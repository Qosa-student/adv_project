// src/pages/api/bookings
import db from '../../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
		  try {
		if (req.method === 'GET') {
			const userId = req.query.userId || req.headers['x-user-id'];
			const bookingId = req.query.bookingId;

			// GET a single booking by id
			if (bookingId) {
				// return booking joined with hotel details so client has hotel name/price/image
				const [rows] = await db.query(
					`SELECT b.id, b.user_id, b.hotel_id, b.check_in, b.check_out, b.total_nights, b.total_price, b.status, b.booked_at,
							h.name AS hotel, h.location, h.price_per_night AS price, h.stars, h.image_url AS image
					 FROM bookings b JOIN hotels h ON b.hotel_id = h.id WHERE b.id = ? LIMIT 1`,
					[bookingId]
				);
				return res.status(200).json({ booking: rows && rows[0] ? rows[0] : null });
			}

			if (!userId) return res.status(400).json({ error: 'userId is required' });

			// return the user's bookings joined with hotel details
			const [rows] = await db.query(
				`SELECT b.id, b.user_id, b.hotel_id, b.check_in, b.check_out, b.total_nights, b.total_price, b.status, b.booked_at,
						h.name AS hotel, h.location, h.price_per_night AS price, h.stars, h.image_url AS image
				 FROM bookings b JOIN hotels h ON b.hotel_id = h.id WHERE b.user_id = ? ORDER BY b.booked_at DESC`,
				[userId]
			);
			return res.status(200).json({ bookings: rows });
		}

		if (req.method === 'POST') {
			console.info('[bookings] POST payload:', req.body || {});
			let { userId, hotelId, checkIn, checkOut, total_nights, total_price, status = 'confirmed', userEmail, userName } = req.body || {};
			// allow creating by providing userId OR userEmail (server will create/find). hotelId, checkIn, checkOut and total_price are required
			if ((!userId && !userEmail) || !hotelId || !checkIn || !checkOut || typeof total_price === 'undefined') {
				return res.status(400).json({ error: 'Missing required booking fields (userId|userEmail, hotelId, checkIn, checkOut, total_price)' });
			}

			// If userId missing but an email was provided, attempt server-side find-or-create user
			if (!userId && userEmail) {
				try {
					// try find
					const [found] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [userEmail.toLowerCase()]);
					if (Array.isArray(found) && found.length) {
						userId = found[0].id;
					} else {
						// create user with generated password (hash it)
						const genPassword = `pw_${Math.random().toString(36).slice(2,10)}_${Date.now()}`;



						// hash a generated password and store in `password` column
						const hash = await bcrypt.hash(genPassword, 10);
						const storeValue = hash;

						const nameToUse = userName || (userEmail.split('@')?.[0] ?? 'guest');
						// create user without role_id (roles table removed in the simplified schema)
						const insertSql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
						const params = [nameToUse, userEmail.toLowerCase(), storeValue];
						const [resInsert] = await db.query(insertSql, params);
						if (resInsert && resInsert.insertId) userId = resInsert.insertId;
					}
				} catch (e) {
					console.warn('user create/find during booking failed', e);
				}
					// If still no userId after trying to create, attempt one more find to cover race cases
					if (!userId) {
						try {
							const [afterFind] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [userEmail.toLowerCase()]);
							if (Array.isArray(afterFind) && afterFind.length) userId = afterFind[0].id;
						} catch (e) {
							// ignore
						}
					}
			}

			// compute nights if not provided
			let nights = total_nights;
			try {
				if (typeof nights === 'undefined' || nights === null) {
					const ci = new Date(checkIn);
					const co = new Date(checkOut);
					const diff = Math.max(0, Math.round((co - ci) / (1000 * 60 * 60 * 24)));
					nights = diff || 1;
				}
			} catch (e) {
				nights = total_nights || 1;
			}

			try {
				// Insert without total_nights — many schemas use a generated/stored total_nights column (DATEDIFF)
				const insertSql = 'INSERT INTO bookings (user_id, hotel_id, check_in, check_out, total_price, status) VALUES (?, ?, ?, ?, ?, ?)';
				// normalize numeric ids
				userId = Number(userId);
				hotelId = Number(hotelId);
				const [result] = await db.query(insertSql, [userId, hotelId, checkIn, checkOut, total_price, status]);

								// final verification: ensure user_id is set (try one last resolve by email)
								if (!userId && userEmail) {
									try {
										const [maybe] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [userEmail.toLowerCase()]);
										if (Array.isArray(maybe) && maybe.length) userId = maybe[0].id;
									} catch (e) {}
								}

								if (!userId) {
									return res.status(400).json({ error: 'Could not resolve or create user for this booking (provide userId or userEmail)' });
								}

								// return the created booking row joined with hotel info
								const [rows] = await db.query(
									`SELECT b.id, b.user_id, b.hotel_id, b.check_in, b.check_out, b.total_nights, b.total_price, b.status, b.booked_at,
													h.name AS hotel, h.location, h.price_per_night AS price, h.stars, h.image_url AS image
									 FROM bookings b JOIN hotels h ON b.hotel_id = h.id WHERE b.id = ? LIMIT 1`,
									[result.insertId]
								);
								console.info('[bookings] inserted id=', result.insertId, 'userId=', userId, 'hotelId=', hotelId);
								return res.status(201).json({ booking: rows && rows[0] ? rows[0] : { id: result.insertId, user_id: Number(userId), hotel_id: Number(hotelId) } });
			} catch (err) {
				console.error('[bookings] DB insert failed', err?.message || err);
				// return helpful error to client for debugging (not exposing sensitive SQL)
				return res.status(500).json({ error: 'Failed to insert booking into database', detail: err?.message || String(err) });
			}
		}

		if (req.method === 'DELETE') {
			const bookingId = req.query.bookingId || req.body?.bookingId;
			const userId = req.query.userId || req.body?.userId;
			const hotelId = req.query.hotelId || req.body?.hotelId;

			if (bookingId) {
				const [rows] = await db.query('SELECT id, user_id, hotel_id, check_in, check_out, total_nights, total_price, status, booked_at, booked_at AS createdAt FROM bookings WHERE id = ? LIMIT 1', [bookingId]);
				await db.query('DELETE FROM bookings WHERE id = ?', [bookingId]);
				return res.status(200).json({ success: true, deleted: rows && rows[0] ? rows[0] : null });
			}

			if (!(userId && hotelId)) return res.status(400).json({ error: 'provide bookingId or userId+hotelId to delete' });

			// delete by user+hotel (and optional dates if supplied)
			const checkIn = req.query.checkIn || req.body?.checkIn;
			const checkOut = req.query.checkOut || req.body?.checkOut;

			if (checkIn && checkOut) {
				const [rowsBefore] = await db.query('SELECT id, user_id, hotel_id, check_in, check_out, total_nights, total_price, status, booked_at, booked_at AS createdAt FROM bookings WHERE user_id = ? AND hotel_id = ? AND check_in = ? AND check_out = ? LIMIT 1', [userId, hotelId, checkIn, checkOut]);
				await db.query('DELETE FROM bookings WHERE user_id = ? AND hotel_id = ? AND check_in = ? AND check_out = ? LIMIT 1', [userId, hotelId, checkIn, checkOut]);
				return res.status(200).json({ success: true, deleted: rowsBefore && rowsBefore[0] ? rowsBefore[0] : null });
			}

			// otherwise delete any matching by user/hotel (first one)
			const [rowsBefore] = await db.query('SELECT id, user_id, hotel_id, check_in, check_out, total_nights, total_price, status, booked_at, booked_at AS createdAt FROM bookings WHERE user_id = ? AND hotel_id = ? ORDER BY booked_at DESC LIMIT 1', [userId, hotelId]);
			await db.query('DELETE FROM bookings WHERE id = ?', [rowsBefore && rowsBefore[0] ? rowsBefore[0].id : 0]);
			return res.status(200).json({ success: true, deleted: rowsBefore && rowsBefore[0] ? rowsBefore[0] : null });
		}

		res.setHeader('Allow', ['GET','POST','DELETE']);
		return res.status(405).end(`Method ${req.method} Not Allowed`);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: err.message || 'Internal Server Error' });
	}
}