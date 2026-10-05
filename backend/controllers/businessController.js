const slugify = require('slugify');
const { query } = require('../config/db');
const { logAdminAction } = require('../middleware/auditMiddleware');

// PUBLIC: Get businesses
exports.getBusinesses = async (req, res) => {
  try {
    const { category, location, search, featured, page = 1, limit = 12 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const params = [];
    const whereConditions = ['b.is_active = 1'];

    if (category) {
      whereConditions.push('(c.slug = ? OR c.id = ?)');
      params.push(category, category);
    }

    if (location) {
      whereConditions.push('(l.slug = ? OR l.id = ?)');
      params.push(location, location);
    }

    if (featured === 'true' || featured === '1') {
      whereConditions.push('b.is_featured = 1');
    }

    if (search && search.trim()) {
      whereConditions.push('(b.name LIKE ? OR b.description LIKE ? OR c.name LIKE ? OR l.name LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const countResult = await query(
      `SELECT COUNT(*) as total FROM businesses b
       LEFT JOIN categories c ON b.category_id = c.id
       LEFT JOIN locations l ON b.location_id = l.id
       ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    const businesses = await query(
      `SELECT
        b.id, b.name, b.slug, b.category_id, b.location_id, b.address,
        b.phone, b.whatsapp, b.email, b.website, b.description,
        b.logo_url, b.cover_url, b.rating, b.total_reviews, b.is_featured,
        c.name as category_name, c.slug as category_slug,
        l.name as location_name, l.slug as location_slug
       FROM businesses b
       LEFT JOIN categories c ON b.category_id = c.id
       LEFT JOIN locations l ON b.location_id = l.id
       ${whereClause}
       ORDER BY b.is_featured DESC, b.display_order ASC, b.rating DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), offset]
    );

    return res.json({
      success: true,
      data: businesses,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error('getBusinesses error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch businesses.' });
  }
};

// PUBLIC: Get business by slug
exports.getBusinessBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const businesses = await query(
      `SELECT
        b.*,
        c.name as category_name, c.slug as category_slug,
        l.name as location_name, l.slug as location_slug, l.pincode
       FROM businesses b
       LEFT JOIN categories c ON b.category_id = c.id
       LEFT JOIN locations l ON b.location_id = l.id
       WHERE b.slug = ? LIMIT 1`,
      [slug]
    );

    if (!businesses || businesses.length === 0) {
      return res.status(404).json({ success: false, message: 'Business not found.' });
    }

    const business = businesses[0];

    // Images
    const images = await query(
      'SELECT id, image_url, display_order FROM business_images WHERE business_id = ? ORDER BY display_order ASC',
      [business.id]
    );
    business.images = images;

    // Services
    const services = await query(
      'SELECT id, service_name, description FROM business_services WHERE business_id = ? ORDER BY id ASC',
      [business.id]
    );
    business.services = services;

    // Hours
    const hours = await query(
      'SELECT day_of_week, open_time, close_time, is_closed FROM business_hours WHERE business_id = ? ORDER BY day_of_week ASC',
      [business.id]
    );
    business.hours = hours;

    // Related ads published by this business
    const ads = await query(
      `SELECT a.id, a.title, a.slug, a.price, a.price_display, a.phone, a.address, a.is_featured,
        (SELECT image_url FROM advertisement_images WHERE advertisement_id = a.id ORDER BY is_primary DESC LIMIT 1) as primary_image
       FROM advertisements a
       WHERE a.business_name = ? AND a.status = 'published'
       ORDER BY a.created_at DESC LIMIT 4`,
      [business.name]
    );
    business.advertisements = ads;

    return res.json({ success: true, data: business });
  } catch (error) {
    console.error('getBusinessBySlug error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch business details.' });
  }
};

// ADMIN: Get all businesses
exports.getAdminBusinesses = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 20 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const params = [];
    const whereConditions = [];

    if (category) {
      whereConditions.push('b.category_id = ?');
      params.push(category);
    }

    if (search && search.trim()) {
      whereConditions.push('(b.name LIKE ? OR b.phone LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countResult = await query(
      `SELECT COUNT(*) as total FROM businesses b ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    const businesses = await query(
      `SELECT
        b.id, b.name, b.slug, b.category_id, b.location_id, b.address,
        b.phone, b.whatsapp, b.rating, b.is_featured, b.is_active, b.created_at,
        c.name as category_name,
        l.name as location_name
       FROM businesses b
       LEFT JOIN categories c ON b.category_id = c.id
       LEFT JOIN locations l ON b.location_id = l.id
       ${whereClause}
       ORDER BY b.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), offset]
    );

    return res.json({
      success: true,
      data: businesses,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error('getAdminBusinesses error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch businesses.' });
  }
};

// ADMIN: Get single business by ID
exports.getAdminBusinessById = async (req, res) => {
  try {
    const { id } = req.params;
    const businesses = await query('SELECT * FROM businesses WHERE id = ? LIMIT 1', [id]);
    if (!businesses || businesses.length === 0) {
      return res.status(404).json({ success: false, message: 'Business not found.' });
    }
    const business = businesses[0];
    const services = await query('SELECT * FROM business_services WHERE business_id = ?', [id]);
    business.services = services;
    return res.json({ success: true, data: business });
  } catch (error) {
    console.error('getAdminBusinessById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch business.' });
  }
};

// ADMIN ONLY: Create business
exports.createBusiness = async (req, res) => {
  try {
    const {
      name,
      category_id,
      location_id,
      address,
      phone,
      whatsapp,
      email,
      website,
      description,
      logo_url,
      cover_url,
      rating = 4.8,
      is_featured = 0,
      services = []
    } = req.body;

    if (!name || !category_id || !address || !phone || !description) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, address, phone, and description are required.'
      });
    }

    let baseSlug = slugify(name, { lower: true, strict: true }) || 'business';
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await query('SELECT id FROM businesses WHERE slug = ? LIMIT 1', [slug]);
      if (existing.length === 0) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const result = await query(
      `INSERT INTO businesses (
        name, slug, category_id, location_id, address, phone, whatsapp,
        email, website, description, logo_url, cover_url, rating, is_featured, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        name.trim(),
        slug,
        parseInt(category_id, 10),
        location_id ? parseInt(location_id, 10) : null,
        address.trim(),
        phone.trim(),
        whatsapp ? whatsapp.trim() : null,
        email ? email.trim() : null,
        website ? website.trim() : null,
        description.trim(),
        logo_url || null,
        cover_url || null,
        parseFloat(rating) || 4.8,
        is_featured ? 1 : 0
      ]
    );

    const businessId = result.insertId;

    if (Array.isArray(services) && services.length > 0) {
      for (const s of services) {
        if (s.name || typeof s === 'string') {
          await query(
            'INSERT INTO business_services (business_id, service_name, description) VALUES (?, ?, ?)',
            [businessId, s.name || s, s.description || null]
          );
        }
      }
    }

    await logAdminAction(req.user.id, 'Business created', 'business', businessId, { name, slug }, req);

    return res.status(201).json({ success: true, message: 'Business created successfully.', data: { id: businessId, slug } });
  } catch (error) {
    console.error('createBusiness error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create business.' });
  }
};

// ADMIN ONLY: Update business
exports.updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      category_id,
      location_id,
      address,
      phone,
      whatsapp,
      email,
      website,
      description,
      logo_url,
      cover_url,
      rating,
      is_featured,
      is_active
    } = req.body;

    await query(
      `UPDATE businesses SET
        name = COALESCE(?, name),
        category_id = COALESCE(?, category_id),
        location_id = COALESCE(?, location_id),
        address = COALESCE(?, address),
        phone = COALESCE(?, phone),
        whatsapp = ?,
        email = ?,
        website = ?,
        description = COALESCE(?, description),
        logo_url = COALESCE(?, logo_url),
        cover_url = COALESCE(?, cover_url),
        rating = COALESCE(?, rating),
        is_featured = COALESCE(?, is_featured),
        is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [
        name ? name.trim() : null,
        category_id ? parseInt(category_id, 10) : null,
        location_id ? parseInt(location_id, 10) : null,
        address ? address.trim() : null,
        phone ? phone.trim() : null,
        whatsapp !== undefined ? whatsapp : null,
        email !== undefined ? email : null,
        website !== undefined ? website : null,
        description ? description.trim() : null,
        logo_url || null,
        cover_url || null,
        rating ? parseFloat(rating) : null,
        is_featured !== undefined ? (is_featured ? 1 : 0) : null,
        is_active !== undefined ? (is_active ? 1 : 0) : null,
        id
      ]
    );

    await logAdminAction(req.user.id, 'Business edited', 'business', id, { name }, req);

    return res.json({ success: true, message: 'Business updated successfully.' });
  } catch (error) {
    console.error('updateBusiness error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update business.' });
  }
};

// ADMIN ONLY: Delete business
exports.deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM businesses WHERE id = ?', [id]);
    await logAdminAction(req.user.id, 'Business deleted', 'business', id, {}, req);
    return res.json({ success: true, message: 'Business deleted successfully.' });
  } catch (error) {
    console.error('deleteBusiness error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete business.' });
  }
};
