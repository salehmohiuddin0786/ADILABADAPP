const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

async function verifyToken(req, res, next) {
  try {
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    // Check if token has been revoked / blacklisted
    try {
      const revoked = await query('SELECT id FROM revoked_tokens WHERE token = ? LIMIT 1', [token]);
      if (revoked && revoked.length > 0) {
        return res.status(401).json({ success: false, message: 'Session has been invalidated. Please sign in again.' });
      }
    } catch (e) {
      // Table check fallback if DB error
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve user and role
    const users = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.is_active, u.created_at, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? LIMIT 1`,
      [decoded.id]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found or session expired.' });
    }

    const user = users[0];
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact support.' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrative privileges required.'
    });
  }
  next();
}

function requireOwner(req, res, next) {
  const allowed = ['owner', 'BUSINESS_OWNER', 'INDIVIDUAL_OWNER', 'admin', 'SUPER_ADMIN'];
  if (!req.user || !allowed.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Business Owner privileges required.'
    });
  }
  next();
}

function requireStaff(req, res, next) {
  const allowed = ['staff', 'MODERATOR', 'SUPPORT_STAFF', 'admin', 'SUPER_ADMIN'];
  if (!req.user || !allowed.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Staff operational privileges required.'
    });
  }
  next();
}

async function optionalToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const users = await query(
        `SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.is_active, r.name as role
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.id = ? AND u.is_active = 1 LIMIT 1`,
        [decoded.id]
      );
      if (users && users.length > 0) {
        req.user = users[0];
        req.token = token;
      }
    }
  } catch (err) {
    // Ignore invalid optional tokens
  }
  next();
}

module.exports = {
  verifyToken,
  requireAdmin,
  requireOwner,
  requireStaff,
  optionalToken
};
