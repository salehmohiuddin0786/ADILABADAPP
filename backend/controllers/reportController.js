const { query } = require('../config/db');
const { logAdminAction } = require('../middleware/auditMiddleware');

// PUBLIC/USER: Submit advertisement report
exports.createReport = async (req, res) => {
  try {
    const {
      advertisement_id,
      reason,
      description,
      reporter_name,
      reporter_contact
    } = req.body;

    const validReasons = ['spam', 'fake_information', 'wrong_contact', 'fraud_scam', 'inappropriate_content', 'other'];
    if (!advertisement_id || !reason || !validReasons.includes(reason)) {
      return res.status(400).json({ success: false, message: 'Valid advertisement ID and report reason are required.' });
    }

    const userId = req.user ? req.user.id : null;

    const result = await query(
      `INSERT INTO advertisement_reports (
        advertisement_id, user_id, reporter_name, reporter_contact, reason, description, status
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [
        parseInt(advertisement_id, 10),
        userId,
        reporter_name ? reporter_name.trim() : null,
        reporter_contact ? reporter_contact.trim() : null,
        reason,
        description ? description.trim() : null
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you for reporting. Our moderation team will review this advertisement immediately.',
      data: { report_id: result.insertId }
    });
  } catch (error) {
    console.error('createReport error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit report.' });
  }
};

// ADMIN: Get all reports
exports.getAdminReports = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const params = [];
    let whereClause = '';

    if (status) {
      whereClause = 'WHERE r.status = ?';
      params.push(status);
    }

    const countResult = await query(`SELECT COUNT(*) as total FROM advertisement_reports r ${whereClause}`, params);
    const total = countResult[0]?.total || 0;

    const reports = await query(
      `SELECT
        r.id, r.advertisement_id, r.user_id, r.reporter_name, r.reporter_contact,
        r.reason, r.description, r.status, r.admin_notes, r.created_at, r.updated_at,
        a.title as advertisement_title, a.slug as advertisement_slug, a.status as advertisement_status,
        a.business_name,
        u.email as reporter_user_email
       FROM advertisement_reports r
       LEFT JOIN advertisements a ON r.advertisement_id = a.id
       LEFT JOIN users u ON r.user_id = u.id
       ${whereClause}
       ORDER BY r.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), offset]
    );

    return res.json({
      success: true,
      data: reports,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error('getAdminReports error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch reports.' });
  }
};

// ADMIN: Update report status (take action on advertisement)
exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes, disable_ad } = req.body;

    const validStatuses = ['pending', 'under_review', 'resolved', 'dismissed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid report status.' });
    }

    const reports = await query('SELECT advertisement_id FROM advertisement_reports WHERE id = ? LIMIT 1', [id]);
    if (!reports || reports.length === 0) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    const adId = reports[0].advertisement_id;

    await query(
      `UPDATE advertisement_reports SET
        status = ?,
        admin_notes = COALESCE(?, admin_notes)
       WHERE id = ?`,
      [status, admin_notes || null, id]
    );

    // If admin chose to unpublish or disable ad
    if (disable_ad && adId) {
      await query(`UPDATE advertisements SET status = 'archived' WHERE id = ?`, [adId]);
      await logAdminAction(req.user.id, 'Advertisement unpublished via report', 'advertisement', adId, { report_id: id }, req);
    }

    await logAdminAction(req.user.id, 'Report resolved', 'report', id, { status, adId, disable_ad }, req);

    return res.json({ success: true, message: 'Report updated successfully.' });
  } catch (error) {
    console.error('updateReportStatus error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update report.' });
  }
};
