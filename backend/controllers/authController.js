const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../config/db');
const { logAdminAction } = require('../middleware/auditMiddleware');

function generateToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET must be configured in environment');
  }
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
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
      `SELECT u.id, u.name, u.email, u.phone, u.password_hash, u.avatar_url, u.address, u.bio, u.is_active, u.created_at, r.name as role
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
        address: user.address,
        bio: user.bio,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, accountType } = req.body;

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

    const isOwnerReg = accountType === 'owner' || req.body.role === 'owner';
    const targetRoleId = isOwnerReg ? 3 : 2;
    const targetRoleName = isOwnerReg ? 'owner' : 'user';

    const result = await query(
      `INSERT INTO users (role_id, name, email, phone, password_hash, is_active)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [targetRoleId, name.trim(), cleanEmail, phone ? phone.trim() : null, passwordHash]
    );

    const newUser = {
      id: result.insertId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone || null,
      avatar_url: null,
      address: null,
      bio: null,
      role: targetRoleName,
      created_at: new Date()
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
    const users = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.address, u.bio, u.is_active, u.created_at, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? LIMIT 1`,
      [req.user.id]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const user = users[0];

    const [favoritesCount] = await query(
      'SELECT COUNT(*) as count FROM favorites WHERE user_id = ?',
      [req.user.id]
    );

    return res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
        address: user.address,
        bio: user.bio,
        role: user.role,
        created_at: user.created_at,
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
    const { name, phone, avatar_url, address, bio } = req.body;

    // Strict validation and prevention of privilege escalation:
    // Only name, phone, avatar_url, address, bio can be updated by the user for their own account.
    await query(
      `UPDATE users
       SET name = COALESCE(?, name),
           phone = COALESCE(?, phone),
           avatar_url = COALESCE(?, avatar_url),
           address = COALESCE(?, address),
           bio = COALESCE(?, bio)
       WHERE id = ?`,
      [name ? name.trim() : null, phone ? phone.trim() : null, avatar_url || null, address ? address.trim() : null, bio ? bio.trim() : null, req.user.id]
    );

    const updated = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.address, u.bio, u.is_active, u.created_at, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? LIMIT 1`,
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

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file uploaded.' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    await query('UPDATE users SET avatar_url = ? WHERE id = ?', [avatarUrl, req.user.id]);

    return res.json({
      success: true,
      message: 'Avatar uploaded and updated successfully',
      avatar_url: avatarUrl
    });
  } catch (error) {
    console.error('uploadAvatar error:', error);
    return res.status(500).json({ success: false, message: 'Failed to upload avatar.' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    if (!current_password || !new_password) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const [user] = await query('SELECT id, password_hash FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(current_password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password.' });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await query('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);

    return res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('changePassword error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update password.' });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.token;
    if (token) {
      // Invalidate token by saving to revoked_tokens table
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await query(
        'INSERT IGNORE INTO revoked_tokens (token, user_id, expires_at) VALUES (?, ?, ?)',
        [token, req.user ? req.user.id : null, expiresAt]
      );
    }

    return res.json({
      success: true,
      message: 'Logged out successfully. Session invalidated.'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ success: false, message: 'Error during logout.' });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password confirmation is required to delete account.' });
    }

    const [user] = await query('SELECT id, password_hash, role_id FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Protect Super Admin from accidental self-deletion
    if (user.role_id === 1) {
      return res.status(403).json({ success: false, message: 'Administrator accounts cannot be deleted directly.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password.' });
    }

    await query('DELETE FROM users WHERE id = ?', [req.user.id]);

    return res.json({ success: true, message: 'Your account and personal data have been deleted successfully.' });
  } catch (error) {
    console.error('deleteAccount error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete account.' });
  }
};
