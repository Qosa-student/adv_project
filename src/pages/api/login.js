// src/pages/api/login.js
import db from '../../../lib/db';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {

    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    // Our users table uses a `password` column.
    const query = `SELECT u.id, u.name, u.email, u.password as password FROM users u WHERE u.email = ? LIMIT 1`;

    const [rows] = await db.query(query, [email.toLowerCase()]);

    if (!rows.length) return res.status(404).json({ error: 'No account found with this email' });
    const user = rows[0];

    // Accept either bcrypt-hashed password or plaintext stored password
    let match = false;
    try {
      if (user.password) {
        match = await bcrypt.compare(password, user.password);
      }
    } catch (e) {
      match = false;
    }
    // Fallback: if bcrypt compare failed or password wasn't hashed, allow plaintext match
    if (!match && user.password && password === user.password) {
      match = true;
    }
    if (!match) return res.status(401).json({ error: 'Incorrect email or password' });

    // Return sanitized user info (no password). No roles in simplified schema.
    return res.status(200).json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
