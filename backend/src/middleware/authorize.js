/**
 * ADILABAD APP — BACKEND AUTHORIZATION MIDDLEWARE
 * Strictly Enforced Server-Side Access Control
 */

const { ROLES, PANEL_ROLE_MAPPING } = require('../config/roles');
const { hasPermission } = require('../config/permissions');
const { query } = require('../database/db');

/**
 * Checks if user has at least one of the allowed roles
 */
function requireRole(...allowedRoles) {
  const flattenedRoles = allowedRoles.flat().map(r => r.toUpperCase());
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const userRoles = req.user.roles || [req.user.primary_role?.toUpperCase()];
    
    // Super admin bypasses all role checks
    if (userRoles.includes(ROLES.SUPER_ADMIN)) {
      return next();
    }

    const hasMatch = userRoles.some(r => flattenedRoles.includes(r));
    if (!hasMatch) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not possess the required role authority for this action.'
      });
    }

    next();
  };
}

/**
 * Checks fine-grained permission
 */
function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const userRoles = req.user.roles || [req.user.primary_role?.toUpperCase()];
    if (hasPermission(userRoles, permission)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Missing mandatory permission: [${permission}].`
    });
  };
}

/**
 * Validates panel access based on backend-configured role mapping
 */
function requirePanelAccess(panelName) {
  const allowed = PANEL_ROLE_MAPPING[panelName] || [];
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const userRoles = req.user.roles || [req.user.primary_role?.toUpperCase()];
    if (userRoles.includes(ROLES.SUPER_ADMIN)) {
      return next();
    }

    const hasAccess = userRoles.some(r => allowed.includes(r));
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Your account is not authorized for the ${panelName}.`
      });
    }

    next();
  };
}

/**
 * Enforces resource ownership at the record level.
 * Prevents user A from modifying or deleting user B's listings.
 */
function requireOwnership(tableName, idParam = 'id', ownerColumn = 'user_id') {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required.' });
      }

      const userRoles = req.user.roles || [req.user.primary_role?.toUpperCase()];
      // Super Admin and Admin can manage all records
      if (userRoles.includes(ROLES.SUPER_ADMIN) || userRoles.includes(ROLES.ADMIN)) {
        return next();
      }

      const recordId = req.params[idParam];
      if (!recordId) {
        return res.status(400).json({ success: false, message: 'Record identifier missing.' });
      }

      const records = await query(
        `SELECT ${ownerColumn} FROM ${tableName} WHERE id = ? LIMIT 1`,
        [recordId]
      );

      if (!records || records.length === 0) {
        return res.status(404).json({ success: false, message: 'Requested resource not found.' });
      }

      const ownerId = records[0][ownerColumn];
      if (String(ownerId) !== String(req.user.id)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not own this record.'
        });
      }

      next();
    } catch (err) {
      console.error('Ownership Check Error:', err);
      return res.status(500).json({ success: false, message: 'Resource authorization failed.' });
    }
  };
}

module.exports = {
  requireRole,
  requirePermission,
  requirePanelAccess,
  requireOwnership
};
