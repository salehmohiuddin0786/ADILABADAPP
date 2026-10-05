const { query } = require('../config/db');
const { logAdminAction } = require('../middleware/auditMiddleware');

// ADMIN: Get all users with search and pagination (never expose password_hash)
exports.getUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const params = [];
    const whereConditions = [];

    if (role) {
      whereConditions.push('r.name = ?');
      params.push(role);
    }

    if (search && search.trim()) {
      whereConditions.push('(u.name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countResult = await query(
      `SELECT COUNT(*) as total FROM users u
       JOIN roles r ON u.role_id = r.id
       ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    const users = await query(
      `SELECT
        u.id, u.name, u.email, u.phone, u.avatar_url, u.is_active, u.created_at,
        r.name as role,
        (SELECT COUNT(*) FROM favorites WHERE user_id = u.id) as favorites_count
       FROM users u
       JOIN roles r ON u.role_id = r.id
       ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), offset]
    );

    return res.json({
      success: true,
      data: users,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error('getUsers error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};

// ADMIN: Toggle user status (activate / deactivate)
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    // Prevent deactivating own admin account
    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate your own active administrator account.' });
    }

    await query('UPDATE users SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id]);

    await logAdminAction(
      req.user.id,
      is_active ? 'User activated' : 'User disabled',
      'user',
      id,
      { is_active: is_active ? 1 : 0 },
      req
    );

    return res.json({ success: true, message: `User account ${is_active ? 'activated' : 'deactivated'} successfully.` });
  } catch (error) {
    console.error('toggleUserStatus error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update user status.' });
  }
};

// ADMIN: Get user profile details
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.avatar_url, u.is_active, u.created_at, r.name as role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.id = ? LIMIT 1`,
      [id]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('getUserById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch user details.' });
  }
};
