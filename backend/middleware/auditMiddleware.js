const { query } = require('../config/db');

async function logAdminAction(adminId, action, entity, entityId, details, req) {
  try {
    const ip = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
    await query(
      `INSERT INTO admin_activity_logs (admin_id, action, entity, entity_id, details, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        adminId,
        action,
        entity,
        entityId || null,
        typeof details === 'object' ? JSON.stringify(details) : (details || null),
        ip
      ]
    );
  } catch (error) {
    console.error('Audit logging error:', error.message);
  }
}

module.exports = {
  logAdminAction
};
