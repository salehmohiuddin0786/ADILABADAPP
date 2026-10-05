const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { logAdminAction } = require('../middleware/auditMiddleware');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'adilabad_super_secret_jwt_key_2026_discover_local',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const users = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.password_hash, u.avatar_url, u.is_active, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email = ? LIMIT 1`,
      [email.trim().toLowerCase()]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'This account has been deactivated. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    if (user.role === 'admin') {
      await logAdminAction(user.id, 'Admin login', 'user', user.id, 'Administrator logged in', req);
    }

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existing = await query('SELECT id FROM users WHERE email = ? LIMIT 1', [cleanEmail]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Register user with role_id = 2 ('user'). Standard users CANNOT publish or create ads.
    const result = await query(
      `INSERT INTO users (role_id, name, email, phone, password_hash, is_active)
       VALUES (2, ?, ?, ?, ?, 1)`,
      [name.trim(), cleanEmail, phone ? phone.trim() : null, passwordHash]
    );

    const newUser = {
      id: result.insertId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone || null,
      avatar_url: null,
      role: 'user'
    };

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Welcome to Adilabad App!',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const [favoritesCount] = await query(
      'SELECT COUNT(*) as count FROM favorites WHERE user_id = ?',
      [req.user.id]
    );

    return res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        avatar_url: req.user.avatar_url,
        role: req.user.role,
        favorites_count: favoritesCount ? favoritesCount.count : 0
      }
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar_url } = req.body;

    await query(
      `UPDATE users
       SET name = COALESCE(?, name),
           phone = COALESCE(?, phone),
           avatar_url = COALESCE(?, avatar_url)
       WHERE id = ?`,
      [name || null, phone || null, avatar_url || null, req.user.id]
    );

    const updated = await query(
      'SELECT id, name, email, phone, avatar_url FROM users WHERE id = ?',
      [req.user.id]
    );

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updated[0]
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
};
