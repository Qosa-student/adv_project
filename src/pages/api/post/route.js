import db from '../../../../lib/db';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Support two modes on same endpoint to avoid adding new files:
      // - /api/post => posts (existing behavior)
      // - /api/post?type=hotels => return hotels from DB mapped for front-end
      const type = req.query?.type || '';
      if (type === 'hotels') {
        const [hotels] = await db.query(
          'SELECT id, name, location, price_per_night AS price, stars, image_url AS image, created_at FROM hotels ORDER BY id'
        );
        return res.status(200).json({ hotels });
      }

      if (type === 'bookings') {
        // GET /api/post?type=bookings&userId=123 -> return user's bookings with hotel details
        const userId = req.query?.userId;
        if (!userId) return res.status(400).json({ error: 'userId is required' });

        const [bookings] = await db.query(
          `SELECT b.id, b.user_id, b.hotel_id, b.check_in, b.check_out, b.total_nights, b.total_price, b.status, b.booked_at,
                  h.name AS hotel, h.location, h.price_per_night AS price, h.stars, h.image_url AS image
           FROM bookings b
           JOIN hotels h ON b.hotel_id = h.id
           WHERE b.user_id = ?
           ORDER BY b.booked_at DESC`,
          [userId]
        );

        return res.status(200).json({ bookings });
      }

      const [posts] = await db.query('SELECT * FROM posts');
      return res.status(200).json({ posts });
    }

    // allow POST/DELETE for some types (bookings) via this endpoint so we don't add new files
    if (req.method === 'POST') {
      const type = req.query?.type || '';
      if (type === 'bookings') {
        const { userId, hotelId, checkIn, checkOut, total_price, status = 'confirmed' } = req.body || {};
        if (!userId || !hotelId || !checkIn || !checkOut || typeof total_price === 'undefined') {
          return res.status(400).json({ error: 'Missing required booking fields' });
        }

        const insertSql = `INSERT INTO bookings (user_id, hotel_id, check_in, check_out, total_price, status) VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(insertSql, [userId, hotelId, checkIn, checkOut, total_price, status]);

        // return the newly created booking row joined with hotel details
        const [rows] = await db.query(
          `SELECT b.id, b.user_id, b.hotel_id, b.check_in, b.check_out, b.total_nights, b.total_price, b.status, b.booked_at,
                  h.name AS hotel, h.location, h.price_per_night AS price, h.stars, h.image_url AS image
           FROM bookings b
           JOIN hotels h ON b.hotel_id = h.id
           WHERE b.id = ?`,
          [result.insertId]
        );
        return res.status(201).json({ booking: rows[0] });
      }
    }

    if (req.method === 'DELETE') {
      const type = req.query?.type || '';
      if (type === 'bookings') {
        // delete by booking id OR by userId+hotelId+dates
        const bookingId = req.query?.bookingId || req.body?.bookingId;
        if (bookingId) {
          const [deleted] = await db.query(
            `SELECT b.id, b.user_id, b.hotel_id, b.check_in, b.check_out, b.total_nights, b.total_price, b.status, b.booked_at,
                    h.name AS hotel, h.location, h.price_per_night AS price, h.stars, h.image_url AS image
             FROM bookings b JOIN hotels h ON b.hotel_id = h.id WHERE b.id = ?`,
            [bookingId]
          );
          await db.query('DELETE FROM bookings WHERE id = ?', [bookingId]);
          return res.status(200).json({ deleted: deleted[0] || null });
        }

        const { userId, hotelId, checkIn, checkOut } = req.query;
        if (!(userId && hotelId)) {
          return res.status(400).json({ error: 'provide booking id or userId+hotelId to delete' });
        }

        // attempt delete by criteria
        const [rowsBefore] = await db.query(
          `SELECT b.id, b.user_id, b.hotel_id, b.check_in, b.check_out, b.total_nights, b.total_price, b.status, b.booked_at,
                  h.name AS hotel, h.location, h.price_per_night AS price, h.stars, h.image_url AS image
           FROM bookings b JOIN hotels h ON b.hotel_id = h.id
           WHERE b.user_id = ? AND b.hotel_id = ? AND b.check_in = ? AND b.check_out = ? LIMIT 1`,
          [userId, hotelId, checkIn, checkOut]
        );
        await db.query('DELETE FROM bookings WHERE user_id = ? AND hotel_id = ? AND check_in = ? AND check_out = ? LIMIT 1', [userId, hotelId, checkIn, checkOut]);
        return res.status(200).json({ deleted: rowsBefore[0] || null });
      }
    }

    res.setHeader('Allow', ['GET','POST','DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}