const slugify = require('slugify');
const { query } = require('../config/db');
const { logAdminAction } = require('../middleware/auditMiddleware');

// PUBLIC: Get published advertisements with filtering, sorting, pagination
exports.getAdvertisements = async (req, res) => {
  try {
    const {
      category,
      location,
      search,
      featured,
      sort = 'latest',
      page = 1,
      limit = 12
    } = req.query;

    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const params = [];
    let whereConditions = [`a.status = 'published'`];

    if (category) {
      whereConditions.push(`(c.slug = ? OR c.id = ?)`);
      params.push(category, category);
    }

    if (location) {
      whereConditions.push(`(l.slug = ? OR l.id = ?)`);
      params.push(location, location);
    }

    if (featured === 'true' || featured === '1') {
      whereConditions.push(`a.is_featured = 1`);
    }

    if (search && search.trim()) {
      whereConditions.push(`(a.title LIKE ? OR a.description LIKE ? OR a.business_name LIKE ? OR c.name LIKE ? OR l.name LIKE ?)`);
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    let orderBy = 'ORDER BY a.is_featured DESC, a.created_at DESC';
    if (sort === 'popular') {
      orderBy = 'ORDER BY a.views_count DESC, a.created_at DESC';
    } else if (sort === 'latest') {
      orderBy = 'ORDER BY a.created_at DESC';
    } else if (sort === 'featured') {
      orderBy = 'ORDER BY a.is_featured DESC, a.created_at DESC';
    } else if (sort === 'price_asc') {
      orderBy = 'ORDER BY a.price ASC';
    } else if (sort === 'price_desc') {
      orderBy = 'ORDER BY a.price DESC';
    }

    // Total count query
    const countSql = `
      SELECT COUNT(*) as total
      FROM advertisements a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN locations l ON a.location_id = l.id
      ${whereClause}
    `;
    const countResult = await query(countSql, params);
    const total = countResult[0]?.total || 0;

    // Items query with primary image
    const itemsSql = `
      SELECT
        a.id, a.title, a.slug, a.business_name, a.category_id, a.location_id,
        a.price, a.price_type, a.price_display, a.phone, a.whatsapp, a.website,
        a.address, a.is_featured, a.status, a.views_count, a.clicks_count, a.shares_count,
        a.created_at,
        c.name as category_name, c.slug as category_slug, c.icon as category_icon,
        l.name as location_name, l.slug as location_slug,
        (
          SELECT image_url FROM advertisement_images
          WHERE advertisement_id = a.id
          ORDER BY is_primary DESC, display_order ASC, id ASC
          LIMIT 1
        ) as primary_image
      FROM advertisements a
      LEFT JOIN categories c ON a.category_id = c.id
      LEFT JOIN locations l ON a.location_id = l.id
      ${whereClause}
      ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const items = await query(itemsSql, [...params, parseInt(limit, 10), offset]);

    return res.json({
      success: true,
      data: items,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error('getAdvertisements error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch advertisements.' });
  }
};

// PUBLIC: Get advertisement details by slug
exports.getAdvertisementBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const ads = await query(
      `SELECT
        a.id, a.title, a.slug, a.business_name, a.category_id, a.location_id,
        a.description, a.price, a.price_type, a.price_display, a.phone, a.whatsapp,
        a.website, a.address, a.latitude, a.longitude, a.video_url, a.is_featured,
        a.status, a.start_date, a.expiry_date, a.views_count, a.clicks_count, a.shares_count,
        a.created_at, a.updated_at,
        c.name as category_name, c.slug as category_slug, c.icon as category_icon,
        l.name as location_name, l.slug as location_slug, l.pincode
       FROM advertisements a
       LEFT JOIN categories c ON a.category_id = c.id
       LEFT JOIN locations l ON a.location_id = l.id
       WHERE a.slug = ? LIMIT 1`,
      [slug]
    );

    if (!ads || ads.length === 0) {
      return res.status(404).json({ success: false, message: 'Advertisement not found.' });
    }

    const ad = ads[0];

    // Only allow admins to view non-published ads directly
    if (ad.status !== 'published' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ success: false, message: 'Advertisement is not currently published.' });
    }

    // Fetch all images
    const images = await query(
      `SELECT id, image_url, is_primary, display_order
       FROM advertisement_images
       WHERE advertisement_id = ?
       ORDER BY is_primary DESC, display_order ASC, id ASC`,
      [ad.id]
    );

    ad.images = images;

    // Track view count (asynchronously)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    query('UPDATE advertisements SET views_count = views_count + 1 WHERE id = ?', [ad.id]).catch(() => {});
    query('INSERT INTO advertisement_views (advertisement_id, ip_address, user_agent) VALUES (?, ?, ?)', [ad.id, ip, userAgent]).catch(() => {});

    // Related advertisements in the same category
    const related = await query(
      `SELECT
        a.id, a.title, a.slug, a.business_name, a.price, a.price_display,
        a.phone, a.address, a.is_featured,
        c.name as category_name, l.name as location_name,
        (
          SELECT image_url FROM advertisement_images
          WHERE advertisement_id = a.id
          ORDER BY is_primary DESC, display_order ASC LIMIT 1
        ) as primary_image
       FROM advertisements a
       LEFT JOIN categories c ON a.category_id = c.id
       LEFT JOIN locations l ON a.location_id = l.id
       WHERE a.category_id = ? AND a.id != ? AND a.status = 'published'
       ORDER BY a.is_featured DESC, a.created_at DESC
       LIMIT 4`,
      [ad.category_id, ad.id]
    );

    ad.related = related;

    return res.json({
      success: true,
      data: ad
    });
  } catch (error) {
    console.error('getAdvertisementBySlug error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch advertisement details.' });
  }
};

// PUBLIC: Track interactions (call, whatsapp, website, directions, share)
exports.trackClick = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // 'call' | 'whatsapp' | 'website' | 'directions' | 'share'

    const validTypes = ['call', 'whatsapp', 'website', 'directions', 'share'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ success: false, message: 'Invalid click tracking type.' });
    }

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    if (type === 'share') {
      await query('UPDATE advertisements SET shares_count = shares_count + 1 WHERE id = ?', [id]);
    } else {
      await query('UPDATE advertisements SET clicks_count = clicks_count + 1 WHERE id = ?', [id]);
    }

    await query(
      'INSERT INTO advertisement_clicks (advertisement_id, click_type, ip_address) VALUES (?, ?, ?)',
      [id, type, ip]
    );

    return res.json({ success: true, message: 'Click tracked.' });
  } catch (error) {
    console.error('trackClick error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record tracking.' });
  }
};

// ADMIN: Get all advertisements (including drafts, scheduled, expired, archived)
exports.getAdminAdvertisements = async (req, res) => {
  try {
    const { status, search, category, page = 1, limit = 20 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const params = [];
    const whereConditions = [];

    if (status) {
      whereConditions.push('a.status = ?');
      params.push(status);
    }

    if (category) {
      whereConditions.push('a.category_id = ?');
      params.push(category);
    }

    if (search && search.trim()) {
      whereConditions.push('(a.title LIKE ? OR a.business_name LIKE ? OR a.phone LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countResult = await query(
      `SELECT COUNT(*) as total FROM advertisements a ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    const ads = await query(
      `SELECT
        a.id, a.title, a.slug, a.business_name, a.category_id, a.location_id,
        a.price, a.price_display, a.phone, a.whatsapp, a.is_featured, a.status,
        a.views_count, a.clicks_count, a.shares_count, a.start_date, a.expiry_date,
        a.created_at,
        c.name as category_name,
        l.name as location_name,
        (
          SELECT image_url FROM advertisement_images
          WHERE advertisement_id = a.id
          ORDER BY is_primary DESC, display_order ASC LIMIT 1
        ) as primary_image
       FROM advertisements a
       LEFT JOIN categories c ON a.category_id = c.id
       LEFT JOIN locations l ON a.location_id = l.id
       ${whereClause}
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), offset]
    );

    return res.json({
      success: true,
      data: ads,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error('getAdminAdvertisements error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin advertisements.' });
  }
};

// ADMIN: Get single advertisement for editing
exports.getAdminAdvertisementById = async (req, res) => {
  try {
    const { id } = req.params;

    const ads = await query('SELECT * FROM advertisements WHERE id = ? LIMIT 1', [id]);
    if (!ads || ads.length === 0) {
      return res.status(404).json({ success: false, message: 'Advertisement not found.' });
    }

    const ad = ads[0];
    const images = await query(
      'SELECT id, image_url, is_primary, display_order FROM advertisement_images WHERE advertisement_id = ? ORDER BY is_primary DESC, display_order ASC',
      [ad.id]
    );
    ad.images = images;

    return res.json({ success: true, data: ad });
  } catch (error) {
    console.error('getAdminAdvertisementById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch advertisement.' });
  }
};

// ADMIN ONLY: Create advertisement
exports.createAdvertisement = async (req, res) => {
  try {
    const {
      title,
      business_name,
      category_id,
      location_id,
      description,
      price,
      price_type = 'fixed',
      price_display,
      phone,
      whatsapp,
      website,
      address,
      latitude,
      longitude,
      video_url,
      is_featured = 0,
      status = 'published',
      start_date,
      expiry_date,
      images = []
    } = req.body;

    if (!title || !business_name || !category_id || !description || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Title, business name, category, description, phone, and address are required.'
      });
    }

    // Generate unique slug
    let baseSlug = slugify(title, { lower: true, strict: true }) || 'ad';
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await query('SELECT id FROM advertisements WHERE slug = ? LIMIT 1', [slug]);
      if (existing.length === 0) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const result = await query(
      `INSERT INTO advertisements (
        title, slug, business_name, category_id, location_id, description,
        price, price_type, price_display, phone, whatsapp, website, address,
        latitude, longitude, video_url, is_featured, status, start_date, expiry_date,
        created_by
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?
      )`,
      [
        title.trim(),
        slug,
        business_name.trim(),
        parseInt(category_id, 10),
        location_id ? parseInt(location_id, 10) : null,
        description.trim(),
        price ? parseFloat(price) : null,
        price_type,
        price_display || (price ? `₹${price}` : null),
        phone.trim(),
        whatsapp ? whatsapp.trim() : null,
        website ? website.trim() : null,
        address.trim(),
        latitude ? parseFloat(latitude) : null,
        longitude ? parseFloat(longitude) : null,
        video_url || null,
        is_featured ? 1 : 0,
        status,
        start_date || null,
        expiry_date || null,
        req.user.id
      ]
    );

    const newAdId = result.insertId;

    // Insert images if provided
    if (Array.isArray(images) && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imgUrl = typeof images[i] === 'string' ? images[i] : images[i].url;
        if (imgUrl) {
          await query(
            `INSERT INTO advertisement_images (advertisement_id, image_url, is_primary, display_order)
             VALUES (?, ?, ?, ?)`,
            [newAdId, imgUrl, i === 0 ? 1 : 0, i]
          );
        }
      }
    }

    await logAdminAction(
      req.user.id,
      'Advertisement created',
      'advertisement',
      newAdId,
      { title, business_name, status, slug },
      req
    );

    return res.status(201).json({
      success: true,
      message: 'Advertisement created successfully.',
      data: { id: newAdId, slug }
    });
  } catch (error) {
    console.error('createAdvertisement error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create advertisement.' });
  }
};

// ADMIN ONLY: Update advertisement
exports.updateAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      business_name,
      category_id,
      location_id,
      description,
      price,
      price_type,
      price_display,
      phone,
      whatsapp,
      website,
      address,
      latitude,
      longitude,
      video_url,
      is_featured,
      status,
      start_date,
      expiry_date,
      images
    } = req.body;

    const existing = await query('SELECT * FROM advertisements WHERE id = ? LIMIT 1', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Advertisement not found.' });
    }

    await query(
      `UPDATE advertisements SET
        title = COALESCE(?, title),
        business_name = COALESCE(?, business_name),
        category_id = COALESCE(?, category_id),
        location_id = COALESCE(?, location_id),
        description = COALESCE(?, description),
        price = ?,
        price_type = COALESCE(?, price_type),
        price_display = ?,
        phone = COALESCE(?, phone),
        whatsapp = ?,
        website = ?,
        address = COALESCE(?, address),
        latitude = ?,
        longitude = ?,
        video_url = ?,
        is_featured = COALESCE(?, is_featured),
        status = COALESCE(?, status),
        start_date = ?,
        expiry_date = ?
       WHERE id = ?`,
      [
        title ? title.trim() : null,
        business_name ? business_name.trim() : null,
        category_id ? parseInt(category_id, 10) : null,
        location_id ? parseInt(location_id, 10) : null,
        description ? description.trim() : null,
        price !== undefined ? (price ? parseFloat(price) : null) : existing[0].price,
        price_type || null,
        price_display !== undefined ? price_display : existing[0].price_display,
        phone ? phone.trim() : null,
        whatsapp !== undefined ? whatsapp : existing[0].whatsapp,
        website !== undefined ? website : existing[0].website,
        address ? address.trim() : null,
        latitude !== undefined ? (latitude ? parseFloat(latitude) : null) : existing[0].latitude,
        longitude !== undefined ? (longitude ? parseFloat(longitude) : null) : existing[0].longitude,
        video_url !== undefined ? video_url : existing[0].video_url,
        is_featured !== undefined ? (is_featured ? 1 : 0) : null,
        status || null,
        start_date !== undefined ? start_date : existing[0].start_date,
        expiry_date !== undefined ? expiry_date : existing[0].expiry_date,
        id
      ]
    );

    // Update images if provided
    if (Array.isArray(images)) {
      await query('DELETE FROM advertisement_images WHERE advertisement_id = ?', [id]);
      for (let i = 0; i < images.length; i++) {
        const imgUrl = typeof images[i] === 'string' ? images[i] : images[i].image_url || images[i].url;
        if (imgUrl) {
          await query(
            `INSERT INTO advertisement_images (advertisement_id, image_url, is_primary, display_order)
             VALUES (?, ?, ?, ?)`,
            [id, imgUrl, i === 0 ? 1 : 0, i]
          );
        }
      }
    }

    await logAdminAction(
      req.user.id,
      'Advertisement edited',
      'advertisement',
      id,
      { title: title || existing[0].title, status: status || existing[0].status },
      req
    );

    return res.json({ success: true, message: 'Advertisement updated successfully.' });
  } catch (error) {
    console.error('updateAdvertisement error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update advertisement.' });
  }
};

// ADMIN ONLY: Delete advertisement
exports.deleteAdvertisement = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await query('SELECT title FROM advertisements WHERE id = ? LIMIT 1', [id]);
    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Advertisement not found.' });
    }

    await query('DELETE FROM advertisements WHERE id = ?', [id]);

    await logAdminAction(
      req.user.id,
      'Advertisement deleted',
      'advertisement',
      id,
      { title: existing[0].title },
      req
    );

    return res.json({ success: true, message: 'Advertisement deleted successfully.' });
  } catch (error) {
    console.error('deleteAdvertisement error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete advertisement.' });
  }
};

// ADMIN ONLY: Toggle Status (publish / unpublish / archive)
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['draft', 'scheduled', 'published', 'expired', 'archived'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    await query('UPDATE advertisements SET status = ? WHERE id = ?', [status, id]);

    await logAdminAction(
      req.user.id,
      status === 'published' ? 'Advertisement published' : 'Advertisement unpublished',
      'advertisement',
      id,
      { status },
      req
    );

    return res.json({ success: true, message: `Status updated to ${status}.` });
  } catch (error) {
    console.error('toggleStatus error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
};

// ADMIN ONLY: Toggle Featured
exports.toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_featured } = req.body;

    await query('UPDATE advertisements SET is_featured = ? WHERE id = ?', [is_featured ? 1 : 0, id]);

    return res.json({ success: true, message: 'Featured status updated.' });
  } catch (error) {
    console.error('toggleFeatured error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update featured flag.' });
  }
};
