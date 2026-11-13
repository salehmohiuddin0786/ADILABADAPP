/**
 * ADILABAD APP — SECURE AUTHENTICATION MIDDLEWARE
 * Backend Token & Session Verification with Multi-Role Capability Extraction
 */

const jwt = require('jsonwebtoken');
const { query } = require('../database/db');
const SECURITY_CONFIG = require('../config/security');
const { ROLES } = require('../config/roles');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No authorization token provided.'
      });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, SECURITY_CONFIG.JWT.SECRET);
    } catch (jwtErr) {
      return res.status(401).json({
        success: false,
        message: 'Session has expired or token is invalid. Please sign in again.'
      });
    }

    // Load user record from MySQL
    let user = null;
    try {
      const users = await query(
        `SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.is_active, 
                r.name AS primary_role
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         WHERE u.id = ? LIMIT 1`,
        [decoded.id]
      );
      if (users && users.length > 0) {
        user = users[0];
      }
    } catch (dbErr) {
      // In dev fallback / offline DB mode, preserve decoded user identity
      if (process.env.NODE_ENV !== 'production' && decoded.id) {
        user = {
          id: decoded.id,
          name: decoded.name || 'Adilabad User',
          email: decoded.email || 'user@adilabadapp.com',
          phone: decoded.phone || '9876543210',
          is_active: 1,
          primary_role: decoded.role || ROLES.CUSTOMER
        };
      } else {
        throw dbErr;
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found.'
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated or suspended by administration.'
      });
    }

    // Query multi-roles & capabilities
    let roles = [user.primary_role || ROLES.CUSTOMER];
    try {
      const additionalRoles = await query(
        `SELECT r.name 
         FROM user_roles ur
         JOIN roles r ON ur.role_id = r.id
         WHERE ur.user_id = ?`,
        [user.id]
      );
      if (additionalRoles && additionalRoles.length > 0) {
        additionalRoles.forEach(r => {
          if (!roles.includes(r.name)) roles.push(r.name);
        });
      }
    } catch (e) {
      // Table may not have been seeded yet in early development
    }

    // Normalize roles to uppercase
    user.roles = roles.map(r => r ? r.toUpperCase() : ROLES.CUSTOMER);
    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Authentication processing failed.'
    });
  }
}

async function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, SECURITY_CONFIG.JWT.SECRET);
      
      const users = await query(
        `SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.is_active, 
                r.name AS primary_role
         FROM users u
         LEFT JOIN roles r ON u.role_id = r.id
         WHERE u.id = ? AND u.is_active = 1 LIMIT 1`,
        [decoded.id]
      );
      if (users && users.length > 0) {
        req.user = users[0];
        req.user.roles = [users[0].primary_role?.toUpperCase() || ROLES.CUSTOMER];
      }
    }
  } catch (err) {
    // Ignore invalid optional tokens
  }
  next();
}

module.exports = {
  authenticate,
  optionalAuthenticate
};
