// src/pages/api/users.js
import db from '../../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Use snake_case column name and alias to createdAt to match phpMyAdmin schema
      const [rows] = await db.query("SELECT id, name, email, created_at AS createdAt FROM users ORDER BY id DESC");
      return res.status(200).json(rows);
    }

    if (req.method === 'POST') {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: 'name, email and password are required' });
      }

      // Hash the password before storing
      const hash = await bcrypt.hash(password, 10);

      // Ensure role 'user' exists and get its id (optional)
      let roleId = null;
      try {
        const [roleRows] = await db.query('SELECT id FROM roles WHERE name = ? LIMIT 1', ['user']);
        if (roleRows.length) roleId = roleRows[0].id;
      } catch (e) {
        // roles table might not exist yet; ignore and continue
        roleId = null;
      }

      try {
        // Our schema uses a `password` column. Store the bcrypt hash for safety.
        const storeValue = hash;

        // Check for existing user by email.
        const [existingRows] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email.toLowerCase()]);
        if (existingRows && existingRows.length > 0) {
          return res.status(409).json({ error: 'An account with this email already exists' });
        }

        const insertQuery = `INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(insertQuery, [name, email.toLowerCase(), storeValue, roleId]);

        // Fetch the inserted row using snake_case created_at alias so response matches phpMyAdmin schema
        const [newRows] = await db.query(
          "SELECT id, name, email, created_at AS createdAt, role_id FROM users WHERE id = ? LIMIT 1",
          [result.insertId]
        );
        const newUser = newRows && newRows[0] ? newRows[0] : { id: result.insertId, name, email: email.toLowerCase(), role_id: roleId };

        return res.status(201).json(newUser);
      } catch (err) {
        // Duplicate email (race or unique constraint)
        if (err && (err.code === 'ER_DUP_ENTRY' || err.errno === 1062)) {
          return res.status(409).json({ error: 'An account with this email already exists' });
        }
        console.error(err);
        return res.status(500).json({ error: err.message || 'Internal Server Error' });
      }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}