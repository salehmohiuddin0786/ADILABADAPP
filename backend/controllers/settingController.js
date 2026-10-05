const { query } = require('../config/db');
const { logAdminAction } = require('../middleware/auditMiddleware');

// PUBLIC: Get application settings
exports.getSettings = async (req, res) => {
  try {
    const rows = await query('SELECT setting_key, setting_value FROM settings');
    const settingsMap = {};
    for (const r of rows) {
      settingsMap[r.setting_key] = r.setting_value;
    }
    return res.json({ success: true, data: settingsMap });
  } catch (error) {
    console.error('getSettings error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch settings.' });
  }
};

// ADMIN: Update application settings
exports.updateSettings = async (req, res) => {
  try {
    const settings = req.body; // { key: value }

    for (const [key, value] of Object.entries(settings)) {
      await query(
        `INSERT INTO settings (setting_key, setting_value)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
        [key, String(value)]
      );
    }

    await logAdminAction(req.user.id, 'Settings changed', 'settings', null, settings, req);

    return res.json({ success: true, message: 'Settings saved successfully.' });
  } catch (error) {
    console.error('updateSettings error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
};

// ADMIN: Get audit activity logs
exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    const [countResult] = await query('SELECT COUNT(*) as total FROM admin_activity_logs');
    const total = countResult?.total || 0;

    const logs = await query(
      `SELECT
        l.id, l.admin_id, l.action, l.entity, l.entity_id, l.details,
        l.ip_address, l.created_at,
        u.name as admin_name, u.email as admin_email
       FROM admin_activity_logs l
       LEFT JOIN users u ON l.admin_id = u.id
       ORDER BY l.created_at DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit, 10), offset]
    );

    return res.json({
      success: true,
      data: logs,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error('getAuditLogs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch audit logs.' });
  }
};
