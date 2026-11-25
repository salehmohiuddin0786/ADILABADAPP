const { query } = require('../config/db');

// GET /api/submissions
exports.getSubmissions = async (req, res) => {
  try {
    const { module: mod, status, owner_id, limit = 50, page = 1 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const conditions = [];
    const params = [];

    if (mod) {
      conditions.push('s.module = ?');
      params.push(mod);
    }
    if (status) {
      conditions.push('s.status = ?');
      params.push(status);
    }
    if (owner_id) {
      conditions.push('s.owner_id = ?');
      params.push(parseInt(owner_id, 10));
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const sql = `
      SELECT s.*, u.name AS owner_name, u.phone AS owner_phone, u.email AS owner_email
      FROM submissions s
      LEFT JOIN users u ON s.owner_id = u.id
      ${whereClause}
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const rows = await query(sql, params);

    // Format specs
    const formatted = rows.map(r => ({
      ...r,
      specs: typeof r.specs === 'string' ? JSON.parse(r.specs) : (r.specs || {})
    }));

    return res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (err) {
    console.error('getSubmissions error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve submissions.' });
  }
};

// GET /api/submissions/counts
exports.getCounts = async (req, res) => {
  try {
    const [all] = await query('SELECT COUNT(*) as total FROM submissions');
    const [pending] = await query("SELECT COUNT(*) as count FROM submissions WHERE status = 'PENDING_APPROVAL'");
    const [approved] = await query("SELECT COUNT(*) as count FROM submissions WHERE status = 'APPROVED' OR status = 'PUBLISHED'");
    const [rejected] = await query("SELECT COUNT(*) as count FROM submissions WHERE status = 'REJECTED'");

    return res.json({
      success: true,
      counts: {
        total: all.total || 0,
        pending: pending.count || 0,
        approved: approved.count || 0,
        rejected: rejected.count || 0
      }
    });
  } catch (err) {
    console.error('getCounts error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve submission counts.' });
  }
};

// POST /api/submissions
exports.createSubmission = async (req, res) => {
  try {
    const { module: mod, title, category, pricing, location, image_url, description, specs } = req.body;
    const ownerId = req.user ? req.user.id : 3;

    if (!mod || !title) {
      return res.status(400).json({ success: false, message: 'Module and title are required.' });
    }

    const specsJson = specs ? (typeof specs === 'string' ? specs : JSON.stringify(specs)) : null;

    const result = await query(
      `INSERT INTO submissions (module, owner_id, title, category, pricing, location, image_url, description, specs, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING_APPROVAL')`,
      [mod, ownerId, title, category || null, pricing || null, location || null, image_url || null, description || null, specsJson]
    );

    return res.status(201).json({
      success: true,
      message: 'Submission created and placed in moderation review queue.',
      data: { id: result.insertId }
    });
  } catch (err) {
    console.error('createSubmission error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create submission.' });
  }
};

// PATCH /api/submissions/:id/moderate
exports.moderateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, comment } = req.body; // 'APPROVE', 'REJECT', 'CHANGES_REQUESTED'
    const reviewerId = req.user ? req.user.id : 1;

    let targetStatus = 'PENDING_APPROVAL';
    if (action === 'APPROVE' || action === 'PUBLISH') targetStatus = 'PUBLISHED';
    else if (action === 'REJECT') targetStatus = 'REJECTED';
    else if (action === 'REQUEST_CHANGES') targetStatus = 'CHANGES_REQUESTED';

    await query('UPDATE submissions SET status = ? WHERE id = ?', [targetStatus, id]);

    if (action) {
      await query(
        `INSERT INTO submission_reviews (submission_id, reviewer_id, comment, decision)
         VALUES (?, ?, ?, ?)`,
        [id, reviewerId, comment || `Status updated to ${targetStatus}`, action]
      );
    }

    return res.json({
      success: true,
      message: `Submission #${id} marked as ${targetStatus}.`,
      status: targetStatus
    });
  } catch (err) {
    console.error('moderateSubmission error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update submission status.' });
  }
};

// DELETE /api/submissions/:id
exports.deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM submissions WHERE id = ?', [id]);
    return res.json({ success: true, message: `Submission #${id} deleted successfully.` });
  } catch (err) {
    console.error('deleteSubmission error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete submission.' });
  }
};
