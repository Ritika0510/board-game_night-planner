import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = Router();

// Email validation helper
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Signup
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address format.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, phone, location',
      [name.trim(), email.trim().toLowerCase(), hashedPassword]
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown';

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required.' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await pool.query(
        'INSERT INTO login_history (user_id, status, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
        [user.id, 'failed', ip, userAgent]
      );
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Record success
    await pool.query(
      'INSERT INTO login_history (user_id, status, ip_address, user_agent) VALUES ($1, $2, $3, $4)',
      [user.id, 'success', ip, userAgent]
    );

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'super_secret_jwt_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location
      }
    });
  } catch (error) {
    next(error);
  }
});

// Change Password
router.put('/change-password', async (req, res, next) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Missing required credentials.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
    }

    const result = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password incorrect.' });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNew, userId]);

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
});

// Login History
router.get('/login-history/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      'SELECT id, status, ip_address, user_agent, login_at FROM login_history WHERE user_id = $1 ORDER BY login_at DESC LIMIT 20',
      [userId]
    );

    res.json({
      success: true,
      history: result.rows
    });
  } catch (error) {
    next(error);
  }
});


export default router;