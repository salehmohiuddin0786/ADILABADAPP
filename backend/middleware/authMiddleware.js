const jwt = require('jsonwebtoken');
const { query } = require('../config/db');

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'adilabad_super_secret_jwt_key_2026_discover_local');

    // Retrieve user and role
    const users = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.is_active, r.name as role
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
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Administrative privileges required. Only administrators can perform this action.'
    });
  }
  next();
}

async function optionalToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'adilabad_super_secret_jwt_key_2026_discover_local');
      const users = await query(
        `SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.is_active, r.name as role
         FROM users u
         JOIN roles r ON u.role_id = r.id
         WHERE u.id = ? AND u.is_active = 1 LIMIT 1`,
        [decoded.id]
      );
      if (users && users.length > 0) {
        req.user = users[0];
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
  optionalToken
};
