// pages/api/reviews.js - FIXED VERSION
import db from '../../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const hotelId = req.query.hotelId;
      const userId = req.query.userId || req.headers['x-user-id'];

      if (hotelId) {
        // Fetch reviews for a hotel with user info
        const [rows] = await db.query(
          `SELECT r.id, r.user_id, r.hotel_id, r.rating, r.comment, r.review_date, r.created_at,
                  u.name AS user_name, u.email AS user_email
            FROM reviews r
            JOIN users u ON u.id = r.user_id
            WHERE r.hotel_id = ?
            ORDER BY r.created_at DESC`,
          [hotelId]
        );
        return res.status(200).json({ reviews: rows });
      }

      if (userId) {
        // Fetch reviews made by a user, include hotel info
        const [rows] = await db.query(
          `SELECT r.id, r.user_id, r.hotel_id, r.rating, r.comment, r.review_date, r.created_at,
                  h.name AS hotel, h.location, h.price_per_night AS price, h.image_url as image
            FROM reviews r
            JOIN hotels h ON h.id = r.hotel_id
            WHERE r.user_id = ?
            ORDER BY r.created_at DESC`,
          [userId]
        );
        return res.status(200).json({ reviews: rows });
      }

      return res.status(400).json({ error: 'hotelId or userId is required' });
    }

    if (req.method === 'POST') {
      console.info('[reviews] POST payload:', req.body || {});
      let { userId, userEmail, userName, hotelId, rating, comment } = req.body || {};

      if (!hotelId || typeof rating === 'undefined') {
        return res.status(400).json({ error: 'hotelId and rating are required' });
      }

      // rating should be integer 1..5
      rating = Number(rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'rating must be an integer between 1 and 5' });
      }

      // Resolve userId:
      // - If userId provided we'll verify it exists.
      // - If userId not provided, try find-or-create using userEmail.
      if (userId) {
        try {
          const [found] = await db.query('SELECT id FROM users WHERE id = ? LIMIT 1', [userId]);
          if (!Array.isArray(found) || !found.length) {
            // fallback: if we also received userEmail, try to find/create by email
            if (userEmail) {
              const [byEmail] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [userEmail.toLowerCase()]);
              if (Array.isArray(byEmail) && byEmail.length) userId = byEmail[0].id;
              else userId = null; // will trigger create below when userEmail exists
            } else {
              // userId provided but not found and no email given — clear it and let caller provide email
              userId = null;
            }
          }
        } catch (e) {
          console.warn('[reviews] error verifying userId', e);
          userId = null; // continue into create flow if possible
        }
      }

      // find or create user if only email provided or when userId was cleared above
      if (!userId && userEmail) {
        try {
          const [found] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [userEmail.toLowerCase()]);
          if (Array.isArray(found) && found.length) {
            userId = found[0].id;
          } else {
            const genPassword = `pw_${Math.random().toString(36).slice(2,10)}_${Date.now()}`;
            const hash = await bcrypt.hash(genPassword, 10);
            const nameToUse = userName || (userEmail.split('@')?.[0] ?? 'guest');
            const insertSql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
            const [resInsert] = await db.query(insertSql, [nameToUse, userEmail.toLowerCase(), hash]);
            if (resInsert && resInsert.insertId) userId = resInsert.insertId;
          }
        } catch (e) {
          console.warn('user create/find during review failed', e);
        }

        if (!userId) {
          try {
            const [afterFind] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [userEmail.toLowerCase()]);
            if (Array.isArray(afterFind) && afterFind.length) userId = afterFind[0].id;
          } catch (e) {}
        }
      }

      if (!userId) return res.status(400).json({ error: 'userId or userEmail is required' });

      userId = Number(userId);
      hotelId = Number(hotelId);

      // basic validation: hotel must exist otherwise FK will reject insert
      try {
        const [hrows] = await db.query('SELECT id FROM hotels WHERE id = ? LIMIT 1', [hotelId]);
        if (!Array.isArray(hrows) || !hrows.length) {
          return res.status(400).json({ error: 'Invalid hotelId - hotel not found', detail: `hotelId ${hotelId} not present in hotels` });
        }
      } catch (e) {
        console.error('[reviews] error validating hotelId', e);
        return res.status(500).json({ error: 'Failed to validate hotelId', detail: e?.message || String(e) });
      }

      // NOTE: We intentionally do NOT block creation of multiple reviews by
      // the same user. Historically there was an application-level check that
      // returned 409 for any existing review and prevented users from leaving
      // reviews on other hotels. To allow a user to review many hotels, and
      // to keep the server logic simple, skip a pre-check here and let the
      // INSERT happen. If the database enforces a uniqueness constraint that
      // prevents the insert, we'll surface a clear error back to the client.

      // Try insert; if the DB enforces uniqueness (user+hotel) the insert will
      // fail with ER_DUP_ENTRY. We do NOT want to overwrite historical reviews
      // silently, so return 409 Conflict with a helpful message instead.
      const insertSql = 'INSERT INTO reviews (user_id, hotel_id, rating, comment) VALUES (?, ?, ?, ?)';
      try {
        const [result] = await db.query(insertSql, [userId, hotelId, rating, comment]);

        // fetch and return the inserted row with user info
        const [rows] = await db.query(
          `SELECT r.id, r.user_id, r.hotel_id, r.rating, r.comment, r.review_date, r.created_at,
                  u.name AS user_name, u.email AS user_email
           FROM reviews r
           JOIN users u ON u.id = r.user_id
           WHERE r.id = ? LIMIT 1`,
          [result.insertId]
        );

        // recompute aggregates after insert
        try {
          const [agg] = await db.query('SELECT AVG(rating) AS avg_rating, COUNT(*) AS review_count FROM reviews WHERE hotel_id = ?', [hotelId]);
          // match DB schema precision (one decimal)
          const avg = agg && agg[0] && agg[0].avg_rating ? Number(Number(agg[0].avg_rating).toFixed(1)) : null;
          const count = agg && agg[0] ? Number(agg[0].review_count) : 0;
          if (avg !== null) await db.query('UPDATE hotels SET stars = ? WHERE id = ?', [avg, hotelId]);
          return res.status(201).json({ review: rows && rows[0] ? rows[0] : { id: result.insertId, user_id: userId, hotel_id: hotelId }, stats: { avg_rating: avg, review_count: count } });
        } catch (e) {
          console.warn('[reviews] failed to update aggregates after insert', e);
          return res.status(201).json({ review: rows && rows[0] ? rows[0] : { id: result.insertId, user_id: userId, hotel_id: hotelId } });
        }
      } catch (err) {
        // If the DB unexpectedly enforces a uniqueness constraint, surface a helpful conflict.
        if (err && (err.code === 'ER_DUP_ENTRY' || err.errno === 1062)) {
          console.warn('[reviews] duplicate prevented by DB constraint for user %s hotel %s', userId, hotelId);
          return res.status(409).json({ error: 'Duplicate review prevented by DB constraint', detail: 'The database prevented creating duplicate review entries. Remove unique constraint to allow multiple reviews.' });
        }

        // otherwise propagate so top-level catch can respond
        throw err;
      }
    }

    if (req.method === 'DELETE') {
      // Delete by reviewId or by userId+hotelId
      const reviewId = req.query.reviewId || req.body?.reviewId;
      const userId = req.query.userId || req.body?.userId;
      const hotelId = req.query.hotelId || req.body?.hotelId;

      if (reviewId) {
        const [rows] = await db.query('SELECT * FROM reviews WHERE id = ? LIMIT 1', [reviewId]);
        await db.query('DELETE FROM reviews WHERE id = ?', [reviewId]);
        // recompute aggregates
        try {
          const hotel_id = rows && rows[0] ? rows[0].hotel_id : null;
          if (hotel_id) {
            const [agg] = await db.query('SELECT AVG(rating) AS avg_rating, COUNT(*) AS review_count FROM reviews WHERE hotel_id = ?', [hotel_id]);
            // match DB schema precision (one decimal)
            const avg = agg && agg[0] && agg[0].avg_rating ? Number(Number(agg[0].avg_rating).toFixed(1)) : null;
            const count = agg && agg[0] ? Number(agg[0].review_count) : 0;
            if (avg !== null) await db.query('UPDATE hotels SET stars = ? WHERE id = ?', [avg, hotel_id]);
            return res.status(200).json({ success: true, deleted: rows && rows[0] ? rows[0] : null, stats: { avg_rating: avg, review_count: count } });
          }
        } catch (e) {
          console.warn('[reviews] failed to update aggregates after delete', e);
        }
        return res.status(200).json({ success: true, deleted: rows && rows[0] ? rows[0] : null });
      }

      if (!(userId && hotelId)) return res.status(400).json({ error: 'provide reviewId or userId+hotelId to delete' });
      const [rows] = await db.query('SELECT * FROM reviews WHERE user_id = ? AND hotel_id = ? LIMIT 1', [userId, hotelId]);
      await db.query('DELETE FROM reviews WHERE user_id = ? AND hotel_id = ? LIMIT 1', [userId, hotelId]);
      try {
        // recompute aggregates after delete
        const [agg] = await db.query('SELECT AVG(rating) AS avg_rating, COUNT(*) AS review_count FROM reviews WHERE hotel_id = ?', [hotelId]);
        // match DB schema precision (one decimal)
        const avg = agg && agg[0] && agg[0].avg_rating ? Number(Number(agg[0].avg_rating).toFixed(1)) : null;
        const count = agg && agg[0] ? Number(agg[0].review_count) : 0;
        if (avg !== null) await db.query('UPDATE hotels SET stars = ? WHERE id = ?', [avg, hotelId]);
        return res.status(200).json({ success: true, deleted: rows && rows[0] ? rows[0] : null, stats: { avg_rating: avg, review_count: count } });
      } catch (e) {
        console.warn('[reviews] failed to update aggregates after delete', e);
        return res.status(200).json({ success: true, deleted: rows && rows[0] ? rows[0] : null });
      }
    }

    res.setHeader('Allow', ['GET','POST','DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    if (err && (err.code === 'ER_NO_REFERENCED_ROW_2' || err.errno === 1452)) {
      return res.status(400).json({ error: 'Foreign key violation', detail: 'Referenced user or hotel not found in the database. Please check if the user and hotel exist.' });
    }
    if (err && (err.code === 'ER_BAD_NULL_ERROR' || err.errno === 1048)) {
      return res.status(400).json({ error: 'Null value violation', detail: 'A required field is null. Please provide all required fields.' });
    }
    if (err && (err.code === 'ER_NO_SUCH_TABLE' || err.errno === 1146)) {
      return res.status(500).json({ error: 'Database table not found', detail: 'The reviews table may not exist. Please check database setup.' });
    }
    return res.status(500).json({ error: 'Internal Server Error', detail: err.message || String(err) });
  }
}
