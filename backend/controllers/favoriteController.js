const { query } = require('../config/db');

// USER: Get favorites list (supports filtering by item_type: advertisement, business, event, place)
exports.getFavorites = async (req, res) => {
  try {
    const { type } = req.query;
    const userId = req.user.id;

    let favoritesSql = `
      SELECT f.id as favorite_id, f.item_type, f.item_id, f.created_at as saved_at
      FROM favorites f
      WHERE f.user_id = ?
    `;
    const params = [userId];

    if (type && ['advertisement', 'business', 'event', 'place'].includes(type)) {
      favoritesSql += ` AND f.item_type = ?`;
      params.push(type);
    }

    favoritesSql += ` ORDER BY f.created_at DESC`;
    const rows = await query(favoritesSql, params);

    // Enrich rows with details
    const advertisements = [];
    const businesses = [];
    const events = [];

    for (const item of rows) {
      if (item.item_type === 'advertisement') {
        const ads = await query(
          `SELECT a.id, a.title, a.slug, a.business_name, a.price, a.price_display, a.phone, a.address, a.is_featured,
            c.name as category_name, l.name as location_name,
            (SELECT image_url FROM advertisement_images WHERE advertisement_id = a.id ORDER BY is_primary DESC LIMIT 1) as primary_image
           FROM advertisements a
           LEFT JOIN categories c ON a.category_id = c.id
           LEFT JOIN locations l ON a.location_id = l.id
           WHERE a.id = ? AND a.status = 'published'`,
          [item.item_id]
        );
        if (ads[0]) advertisements.push({ ...ads[0], favorite_id: item.favorite_id, saved_at: item.saved_at });
      } else if (item.item_type === 'business') {
        const biz = await query(
          `SELECT b.id, b.name, b.slug, b.phone, b.address, b.logo_url, b.cover_url, b.rating, b.is_featured,
            c.name as category_name, l.name as location_name
           FROM businesses b
           LEFT JOIN categories c ON b.category_id = c.id
           LEFT JOIN locations l ON b.location_id = l.id
           WHERE b.id = ? AND b.is_active = 1`,
          [item.item_id]
        );
        if (biz[0]) businesses.push({ ...biz[0], favorite_id: item.favorite_id, saved_at: item.saved_at });
      } else if (item.item_type === 'event') {
        const ev = await query(
          `SELECT e.id, e.title, e.slug, e.event_date, e.event_time, e.venue, e.cover_url, e.organizer,
            l.name as location_name
           FROM events e
           LEFT JOIN locations l ON e.location_id = l.id
           WHERE e.id = ? AND e.status = 'published'`,
          [item.item_id]
        );
        if (ev[0]) events.push({ ...ev[0], favorite_id: item.favorite_id, saved_at: item.saved_at });
      }
    }

    return res.json({
      success: true,
      data: {
        all: rows,
        advertisements,
        businesses,
        events
      }
    });
  } catch (error) {
    console.error('getFavorites error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch favorites.' });
  }
};

// USER: Toggle or Add Favorite
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { item_type, item_id } = req.body;

    if (!item_type || !item_id || !['advertisement', 'business', 'event', 'place'].includes(item_type)) {
      return res.status(400).json({ success: false, message: 'Invalid item type or ID.' });
    }

    const existing = await query(
      'SELECT id FROM favorites WHERE user_id = ? AND item_type = ? AND item_id = ? LIMIT 1',
      [userId, item_type, item_id]
    );

    if (existing.length > 0) {
      await query('DELETE FROM favorites WHERE id = ?', [existing[0].id]);
      return res.json({ success: true, is_favorited: false, message: 'Removed from favorites.' });
    } else {
      await query(
        'INSERT INTO favorites (user_id, item_type, item_id) VALUES (?, ?, ?)',
        [userId, item_type, item_id]
      );
      return res.json({ success: true, is_favorited: true, message: 'Saved to favorites!' });
    }
  } catch (error) {
    console.error('toggleFavorite error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update favorite.' });
  }
};

// USER: Remove favorite by ID
exports.removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await query('DELETE FROM favorites WHERE id = ? AND user_id = ?', [id, userId]);
    return res.json({ success: true, message: 'Removed from favorites.' });
  } catch (error) {
    console.error('removeFavorite error:', error);
    return res.status(500).json({ success: false, message: 'Failed to remove favorite.' });
  }
};

// USER: Check if item is favorited
exports.checkFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { item_type, item_id } = req.query;

    const existing = await query(
      'SELECT id FROM favorites WHERE user_id = ? AND item_type = ? AND item_id = ? LIMIT 1',
      [userId, item_type, item_id]
    );

    return res.json({
      success: true,
      is_favorited: existing.length > 0,
      favorite_id: existing[0]?.id || null
    });
  } catch (error) {
    return res.json({ success: true, is_favorited: false });
  }
};
