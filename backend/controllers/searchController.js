const { query } = require('../config/db');

// PUBLIC: Global search across advertisements, businesses, events, and categories
exports.globalSearch = async (req, res) => {
  try {
    const { q, type } = req.query;

    if (!q || !q.trim()) {
      return res.json({
        success: true,
        data: {
          advertisements: [],
          businesses: [],
          events: [],
          categories: []
        }
      });
    }

    const term = `%${q.trim()}%`;

    // 1. Advertisements
    const ads = await query(
      `SELECT
        a.id, a.title, a.slug, a.business_name, a.price, a.price_display,
        a.phone, a.address, a.is_featured,
        c.name as category_name, c.slug as category_slug,
        l.name as location_name,
        (SELECT image_url FROM advertisement_images WHERE advertisement_id = a.id ORDER BY is_primary DESC LIMIT 1) as primary_image
       FROM advertisements a
       LEFT JOIN categories c ON a.category_id = c.id
       LEFT JOIN locations l ON a.location_id = l.id
       WHERE a.status = 'published' AND
             (a.title LIKE ? OR a.description LIKE ? OR a.business_name LIKE ? OR c.name LIKE ? OR l.name LIKE ?)
       ORDER BY a.is_featured DESC, a.created_at DESC
       LIMIT 10`,
      [term, term, term, term, term]
    );

    // 2. Businesses
    const businesses = await query(
      `SELECT
        b.id, b.name, b.slug, b.phone, b.address, b.logo_url, b.cover_url, b.rating, b.is_featured,
        c.name as category_name, l.name as location_name
       FROM businesses b
       LEFT JOIN categories c ON b.category_id = c.id
       LEFT JOIN locations l ON b.location_id = l.id
       WHERE b.is_active = 1 AND
             (b.name LIKE ? OR b.description LIKE ? OR c.name LIKE ? OR l.name LIKE ?)
       ORDER BY b.is_featured DESC, b.rating DESC
       LIMIT 8`,
      [term, term, term, term]
    );

    // 3. Events
    const events = await query(
      `SELECT
        e.id, e.title, e.slug, e.event_date, e.event_time, e.venue, e.cover_url, e.organizer,
        l.name as location_name
       FROM events e
       LEFT JOIN locations l ON e.location_id = l.id
       WHERE e.status = 'published' AND
             (e.title LIKE ? OR e.description LIKE ? OR e.venue LIKE ? OR e.organizer LIKE ?)
       ORDER BY e.event_date ASC
       LIMIT 6`,
      [term, term, term, term]
    );

    // 4. Matching Categories
    const categories = await query(
      `SELECT id, name, slug, icon, description
       FROM categories
       WHERE is_active = 1 AND (name LIKE ? OR description LIKE ?)
       ORDER BY display_order ASC
       LIMIT 6`,
      [term, term]
    );

    return res.json({
      success: true,
      query: q.trim(),
      counts: {
        total: ads.length + businesses.length + events.length + categories.length,
        advertisements: ads.length,
        businesses: businesses.length,
        events: events.length,
        categories: categories.length
      },
      data: {
        advertisements: ads,
        businesses: businesses,
        events: events,
        categories: categories
      }
    });
  } catch (error) {
    console.error('globalSearch error:', error);
    return res.status(500).json({ success: false, message: 'Search execution failed.' });
  }
};

// PUBLIC: Get all locations in Adilabad
exports.getLocations = async (req, res) => {
  try {
    const locations = await query(
      `SELECT
        l.id, l.name, l.slug, l.pincode, l.type,
        (SELECT COUNT(*) FROM advertisements a WHERE a.location_id = l.id AND a.status = 'published') as ads_count
       FROM locations l
       ORDER BY l.name ASC`
    );
    return res.json({ success: true, data: locations });
  } catch (error) {
    console.error('getLocations error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch locations.' });
  }
};
