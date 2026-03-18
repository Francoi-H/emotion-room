import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../db.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();
const SALT_ROUNDS = 12;

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });
    if (!validateEmail(email))
      return res.status(400).json({ error: 'Invalid email format' });
    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rowCount > 0)
      return res.status(409).json({ error: 'Email already in use' });

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const { rows } = await query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2)
       RETURNING id, email, created_at`,
      [email.toLowerCase(), password_hash]
    );

    const user = rows[0];
    res.cookie('token', signToken(user), COOKIE_OPTS);
    return res.status(201).json({ user: { id: user.id, email: user.email } });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const { rows } = await query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    const user = rows[0];
    const dummy = '$2b$12$invalidhashfortimingconstancy000000000000000000000000000';
    const valid = await bcrypt.compare(password, user?.password_hash ?? dummy);

    if (!user || !valid)
      return res.status(401).json({ error: 'Invalid credentials' });

    res.cookie('token', signToken(user), COOKIE_OPTS);
    return res.json({ user: { id: user.id, email: user.email } });
  } catch (err) { next(err); }
});

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  res.clearCookie('token', { ...COOKIE_OPTS, maxAge: 0 });
  return res.json({ message: 'Logged out' });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    return res.json({ user: rows[0] });
  } catch (err) { next(err); }
});

export default router;
