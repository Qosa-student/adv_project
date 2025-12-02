// src/pages/api/users.js
import db from '../../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  try {
    // 1. GET – fetch users
    if (req.method === 'GET') {
      const { userId, email } = req.query || {};

      const [cols] = await db.query("SHOW COLUMNS FROM users LIKE 'profile_pic'");
      const hasProfile = Array.isArray(cols) && cols.length > 0;

      const baseSelect = 'id, name, email, created_at AS createdAt';
      const select = hasProfile ? `${baseSelect}, profile_pic` : baseSelect;

      if (userId || email) {
        const where = userId ? { field: 'id', value: Number(userId) } : { field: 'email', value: String(email).toLowerCase() };
        const [rows] = await db.query(`SELECT ${select} FROM users WHERE ${where.field} = ? LIMIT 1`, [where.value]);
        return res.status(200).json(rows && rows[0] ? rows[0] : {});
      }

      const [rows] = await db.query(`SELECT ${select} FROM users ORDER BY id DESC`);
      return res.status(200).json(rows);
    }

    // 2. POST – register new user
    if (req.method === 'POST') {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'name, email and password are required' });
      }

      const hash = await bcrypt.hash(password, 10);

      try {
        const [existingRows] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email.toLowerCase()]);
        if (existingRows && existingRows.length > 0) {
          return res.status(409).json({ error: 'An account with this email already exists' });
        }

        const insertQuery = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        const [result] = await db.query(insertQuery, [name, email.toLowerCase(), hash]);

        const [newRows] = await db.query(
          "SELECT id, name, email, created_at AS createdAt FROM users WHERE id = ? LIMIT 1",
          [result.insertId]
        );
        const newUser = newRows && newRows[0] ? newRows[0] : { id: result.insertId, name, email: email.toLowerCase() };

        // Set default profile picture if column exists
        try {
          const [cols] = await db.query("SHOW COLUMNS FROM users LIKE 'profile_pic'");
          if (Array.isArray(cols) && cols.length > 0) {
            await db.query('UPDATE users SET profile_pic = ? WHERE id = ?', ['/default-avatar.avif', result.insertId]);
            const [withPic] = await db.query("SELECT id, name, email, created_at AS createdAt, profile_pic FROM users WHERE id = ? LIMIT 1", [result.insertId]);
            if (withPic && withPic[0]) return res.status(201).json(withPic[0]);
          }
        } catch (err) {
          console.warn('profile default assignment failed', err?.message || err);
        }

        return res.status(201).json(newUser);
      } catch (err) {
        if (err && (err.code === 'ER_DUP_ENTRY' || err.errno === 1062)) {
          return res.status(409).json({ error: 'An account with this email already exists' });
        }
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
      }
    }

    // 3. PATCH – update profile picture
    if (req.method === 'PATCH') {
      const { userId, email, profilePic } = req.body || {};
      if (!profilePic || (!userId && !email)) return res.status(400).json({ error: 'userId or email and profilePic required' });

      try {
        const [cols] = await db.query("SHOW COLUMNS FROM users LIKE 'profile_pic'");
        if (!Array.isArray(cols) || cols.length === 0) {
          await db.query("ALTER TABLE users ADD COLUMN profile_pic TEXT NULL");
        }
      } catch (err) {
        console.warn('Failed to ensure profile_pic column exists', err?.message || err);
      }

      try {
        const whereField = userId ? 'id' : 'email';
        const whereVal = userId ? Number(userId) : String(email).toLowerCase();
        await db.query(`UPDATE users SET profile_pic = ? WHERE ${whereField} = ?`, [profilePic, whereVal]);
        const [rows] = await db.query(`SELECT id, name, email, created_at AS createdAt, profile_pic FROM users WHERE ${whereField} = ? LIMIT 1`, [whereVal]);
        return res.status(200).json(rows && rows[0] ? rows[0] : {});
      } catch (err) {
        console.error('Failed to update profile', err);
        return res.status(500).json({ error: 'Failed to update profile' });
      }
    }

    // 4. PUT – CHANGE PASSWORD (NEW!)
    if (req.method === 'PUT') {
      const { userId, oldPassword, newPassword } = req.body;

      if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json({ error: 'userId, oldPassword and newPassword are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      try {
        // Fetch current user with hashed password
        const [rows] = await db.query('SELECT password FROM users WHERE id = ? LIMIT 1', [userId]);
        if (!rows || rows.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        const currentHash = rows[0].password;
        const isValid = await bcrypt.compare(oldPassword, currentHash);

        if (!isValid) {
          return res.status(401).json({ error: 'Incorrect current password' });
        }

        const newHash = await bcrypt.hash(newPassword, 10);

        await db.query('UPDATE users SET password = ? WHERE id = ?', [newHash, userId]);

        return res.status(200).json({ success: true, message: 'Password changed successfully' });
      } catch (err) {
        console.error('Password change error:', err);
        return res.status(500).json({ error: 'Failed to change password' });
      }
    }

    // Method not allowed
    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
