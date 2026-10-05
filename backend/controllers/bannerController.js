const { query } = require('../config/db');
const { logAdminAction } = require('../middleware/auditMiddleware');

// PUBLIC: Get active banners
exports.getBanners = async (req, res) => {
  try {
    const banners = await query(
      `SELECT id, title, subtitle, cta_text, link_url, image_url, priority
       FROM banners
       WHERE is_active = 1
       ORDER BY priority ASC, created_at DESC`
    );
    return res.json({ success: true, data: banners });
  } catch (error) {
    console.error('getBanners error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch banners.' });
  }
};

// ADMIN: Get all banners
exports.getAdminBanners = async (req, res) => {
  try {
    const banners = await query('SELECT * FROM banners ORDER BY priority ASC, id DESC');
    return res.json({ success: true, data: banners });
  } catch (error) {
    console.error('getAdminBanners error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch banners.' });
  }
};

// ADMIN ONLY: Create banner
exports.createBanner = async (req, res) => {
  try {
    const { title, subtitle, cta_text = 'Explore Now', link_url, image_url, priority = 0 } = req.body;
    if (!title || !link_url || !image_url) {
      return res.status(400).json({ success: false, message: 'Title, link URL, and image URL are required.' });
    }

    const result = await query(
      `INSERT INTO banners (title, subtitle, cta_text, link_url, image_url, priority, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [title.trim(), subtitle ? subtitle.trim() : null, cta_text, link_url.trim(), image_url.trim(), parseInt(priority, 10) || 0]
    );

    await logAdminAction(req.user.id, 'Banner updated', 'banner', result.insertId, { title }, req);
    return res.status(201).json({ success: true, message: 'Banner created successfully.', data: { id: result.insertId } });
  } catch (error) {
    console.error('createBanner error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create banner.' });
  }
};

// ADMIN ONLY: Update banner
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, cta_text, link_url, image_url, priority, is_active } = req.body;

    await query(
      `UPDATE banners SET
        title = COALESCE(?, title),
        subtitle = ?,
        cta_text = COALESCE(?, cta_text),
        link_url = COALESCE(?, link_url),
        image_url = COALESCE(?, image_url),
        priority = COALESCE(?, priority),
        is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [
        title ? title.trim() : null,
        subtitle !== undefined ? subtitle : null,
        cta_text || null,
        link_url ? link_url.trim() : null,
        image_url ? image_url.trim() : null,
        priority !== undefined ? parseInt(priority, 10) : null,
        is_active !== undefined ? (is_active ? 1 : 0) : null,
        id
      ]
    );

    await logAdminAction(req.user.id, 'Banner updated', 'banner', id, { title }, req);
    return res.json({ success: true, message: 'Banner updated successfully.' });
  } catch (error) {
    console.error('updateBanner error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update banner.' });
  }
};

// ADMIN ONLY: Delete banner
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM banners WHERE id = ?', [id]);
    await logAdminAction(req.user.id, 'Banner deleted', 'banner', id, {}, req);
    return res.json({ success: true, message: 'Banner deleted successfully.' });
  } catch (error) {
    console.error('deleteBanner error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete banner.' });
  }
};
