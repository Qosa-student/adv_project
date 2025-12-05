// src/pages/api/favorites.js
import db from '../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const userId = req.query.userId || req.headers['x-user-id'];
      if (!userId) return res.status(400).json({ error: 'userId is required' });
      // Return full rows: user_id, hotel_id, created_at and alias createdAt
      const [rows] = await db.query(
        'SELECT user_id, hotel_id, created_at, created_at AS createdAt FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return res.status(200).json({ favorites: rows });
    }

    if (req.method === 'POST') {
      const { userId, hotelId, hotelName } = req.body;
      if (!userId || !hotelId) return res.status(400).json({ error: 'userId and hotelId required' });
      try {
        // If hotelName not provided, attempt to fetch from hotels table
        let name = hotelName;
        if (!name) {
          try {
            const [hotel] = await db.query('SELECT name FROM hotels WHERE id = ? LIMIT 1', [hotelId]);
            if (Array.isArray(hotel) && hotel.length) name = hotel[0].name;
          } catch (e) {
            console.warn('[favorites] failed to fetch hotel name', e);
          }
        }
        
        const insertSql = 'INSERT INTO favorites (user_id, hotel_id, hotel_name) VALUES (?, ?, ?)';
        const [result] = await db.query(insertSql, [userId, hotelId, name || '']);

        // fetch and return the inserted row
        const [rows] = await db.query(
          'SELECT user_id, hotel_id, hotel_name, created_at, created_at AS createdAt FROM favorites WHERE user_id = ? AND hotel_id = ? LIMIT 1',
          [userId, hotelId]
        );
        const favorite = rows && rows[0] ? rows[0] : { user_id: Number(userId), hotel_id: Number(hotelId) };
        return res.status(201).json({ favorite });
      } catch (err) {
        if (err && (err.code === 'ER_DUP_ENTRY' || err.errno === 1062)) {
          // existing row -> return it
          try {
            const [rows] = await db.query(
              'SELECT user_id, hotel_id, hotel_name, created_at, created_at AS createdAt FROM favorites WHERE user_id = ? AND hotel_id = ? LIMIT 1',
              [userId, hotelId]
            );
            const favorite = rows && rows[0] ? rows[0] : { user_id: Number(userId), hotel_id: Number(hotelId), hotel_name: hotelName || '' };
            return res.status(200).json({ favorite });
          } catch (e2) {
            console.error(e2);
            return res.status(500).json({ error: e2.message || 'DB error' });
          }
        }
        console.error(err);
        return res.status(500).json({ error: err.message || 'DB error' });
      }
    }

    if (req.method === 'DELETE') {
      const userId = req.query.userId || req.body.userId;
      const hotelId = req.query.hotelId || req.body.hotelId;
      if (!userId || !hotelId) return res.status(400).json({ error: 'userId and hotelId required' });
      try {
        const [rows] = await db.query(
          'SELECT user_id, hotel_id, hotel_name, created_at, created_at AS createdAt FROM favorites WHERE user_id = ? AND hotel_id = ? LIMIT 1',
          [userId, hotelId]
        );
        await db.query('DELETE FROM favorites WHERE user_id = ? AND hotel_id = ?', [userId, hotelId]);
        const deleted = rows && rows[0] ? rows[0] : null;
        return res.status(200).json({ success: true, deleted });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message || 'DB error' });
      }
    }

    res.setHeader('Allow', ['GET','POST','DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
