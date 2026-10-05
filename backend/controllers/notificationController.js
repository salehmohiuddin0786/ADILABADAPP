const { query } = require('../config/db');
const { logAdminAction } = require('../middleware/auditMiddleware');

// PUBLIC/USER: Get latest notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;

    let sql = `
      SELECT n.id, n.title, n.message, n.type, n.link_url, n.created_at,
        ${userId ? '(SELECT COUNT(*) FROM notification_reads nr WHERE nr.notification_id = n.id AND nr.user_id = ' + mysqlEscape(userId) + ') > 0 as is_read' : '0 as is_read'}
      FROM notifications n
      ORDER BY n.created_at DESC
      LIMIT 25
    `;

    // Safer query using parameters
    const notifications = await query(
      `SELECT n.id, n.title, n.message, n.type, n.link_url, n.created_at,
        (SELECT COUNT(*) FROM notification_reads nr WHERE nr.notification_id = n.id AND nr.user_id = ?) > 0 as is_read
       FROM notifications n
       ORDER BY n.created_at DESC
       LIMIT 25`,
      [userId || 0]
    );

    return res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('getNotifications error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
};

// USER: Mark single or all notifications as read
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (id === 'all') {
      const allNotifs = await query('SELECT id FROM notifications');
      for (const notif of allNotifs) {
        await query('INSERT IGNORE INTO notification_reads (notification_id, user_id) VALUES (?, ?)', [notif.id, userId]);
      }
    } else {
      await query('INSERT IGNORE INTO notification_reads (notification_id, user_id) VALUES (?, ?)', [id, userId]);
    }

    return res.json({ success: true, message: 'Notifications marked as read.' });
  } catch (error) {
    console.error('markAsRead error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update notification state.' });
  }
};

// ADMIN: Get all notifications
exports.getAdminNotifications = async (req, res) => {
  try {
    const notifications = await query('SELECT * FROM notifications ORDER BY created_at DESC');
    return res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('getAdminNotifications error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
};

// ADMIN: Create new broadcast notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type = 'announcement', target_type = 'all', link_url } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required.' });
    }

    const result = await query(
      `INSERT INTO notifications (title, message, type, target_type, link_url)
       VALUES (?, ?, ?, ?, ?)`,
      [title.trim(), message.trim(), type, target_type, link_url ? link_url.trim() : null]
    );

    await logAdminAction(req.user.id, 'Notification broadcasted', 'notification', result.insertId, { title, type }, req);

    return res.status(201).json({ success: true, message: 'Notification published successfully.', data: { id: result.insertId } });
  } catch (error) {
    console.error('createNotification error:', error);
    return res.status(500).json({ success: false, message: 'Failed to publish notification.' });
  }
};

// ADMIN: Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM notifications WHERE id = ?', [id]);
    await logAdminAction(req.user.id, 'Notification deleted', 'notification', id, {}, req);
    return res.json({ success: true, message: 'Notification deleted.' });
  } catch (error) {
    console.error('deleteNotification error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete notification.' });
  }
};
