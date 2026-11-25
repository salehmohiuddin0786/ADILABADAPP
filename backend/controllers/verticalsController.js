const { query } = require('../config/db');

// GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const { q, type, category } = req.query;
    let sql = `
      SELECT j.*, jc.name AS category_name, u.name AS employer_name
      FROM job_listings j
      LEFT JOIN job_categories jc ON j.category_id = jc.id
      LEFT JOIN users u ON j.employer_id = u.id
      WHERE j.status = 'approved'
    `;
    const params = [];

    if (q && q.trim()) {
      sql += ` AND (j.title LIKE ? OR j.company_name LIKE ? OR j.description LIKE ? OR j.location LIKE ?)`;
      const term = `%${q.trim()}%`;
      params.push(term, term, term, term);
    }
    if (type && type !== 'all') {
      sql += ` AND j.job_type = ?`;
      params.push(type);
    }
    if (category && category !== 'all') {
      sql += ` AND (jc.slug = ? OR jc.id = ?)`;
      params.push(category, category);
    }

    sql += ` ORDER BY j.id DESC`;
    const rows = await query(sql, params);

    return res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('getJobs error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve jobs.' });
  }
};

// GET /api/agriculture
exports.getAgriculture = async (req, res) => {
  try {
    const { q, category } = req.query;
    let sql = `SELECT * FROM agricultural_listings WHERE status = 'approved'`;
    const params = [];

    if (q && q.trim()) {
      sql += ` AND (title LIKE ? OR vendor_name LIKE ? OR description LIKE ? OR location LIKE ?)`;
      const term = `%${q.trim()}%`;
      params.push(term, term, term, term);
    }
    if (category && category !== 'all') {
      sql += ` AND listing_type = ?`;
      params.push(category);
    }

    sql += ` ORDER BY id DESC`;
    const rows = await query(sql, params);

    return res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('getAgriculture error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve agricultural listings.' });
  }
};

// GET /api/food
exports.getFood = async (req, res) => {
  try {
    const { q, veg } = req.query;
    let sql = `SELECT * FROM restaurants WHERE status = 'approved'`;
    const params = [];

    if (q && q.trim()) {
      sql += ` AND (name LIKE ? OR cuisine_type LIKE ? OR location LIKE ?)`;
      const term = `%${q.trim()}%`;
      params.push(term, term, term);
    }
    if (veg === 'true' || veg === '1') {
      sql += ` AND is_pure_veg = 1`;
    }

    sql += ` ORDER BY rating DESC, id DESC`;
    const rows = await query(sql, params);

    return res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('getFood error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve restaurants.' });
  }
};

// GET /api/properties
exports.getProperties = async (req, res) => {
  try {
    const { q, type } = req.query;
    let sql = `SELECT * FROM properties WHERE status = 'approved'`;
    const params = [];

    if (q && q.trim()) {
      sql += ` AND (title LIKE ? OR description LIKE ? OR location LIKE ?)`;
      const term = `%${q.trim()}%`;
      params.push(term, term, term);
    }
    if (type && type !== 'all') {
      sql += ` AND property_type = ?`;
      params.push(type);
    }

    sql += ` ORDER BY id DESC`;
    const rows = await query(sql, params);

    return res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('getProperties error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve properties.' });
  }
};

// GET /api/weddings
exports.getWeddings = async (req, res) => {
  try {
    const { q, service_type } = req.query;
    let sql = `SELECT * FROM wedding_vendors WHERE status = 'approved'`;
    const params = [];

    if (q && q.trim()) {
      sql += ` AND (vendor_name LIKE ? OR description LIKE ? OR location LIKE ?)`;
      const term = `%${q.trim()}%`;
      params.push(term, term, term);
    }
    if (service_type && service_type !== 'all') {
      sql += ` AND service_type = ?`;
      params.push(service_type);
    }

    sql += ` ORDER BY id DESC`;
    const rows = await query(sql, params);

    return res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('getWeddings error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve wedding vendors.' });
  }
};

// GET /api/education
exports.getEducation = async (req, res) => {
  try {
    const { q, category } = req.query;
    let sql = `SELECT * FROM institutions WHERE status = 'approved'`;
    const params = [];

    if (q && q.trim()) {
      sql += ` AND (name LIKE ? OR courses_offered LIKE ? OR address LIKE ?)`;
      const term = `%${q.trim()}%`;
      params.push(term, term, term);
    }
    if (category && category !== 'all') {
      sql += ` AND category = ?`;
      params.push(category);
    }

    sql += ` ORDER BY is_verified DESC, id DESC`;
    const rows = await query(sql, params);

    return res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('getEducation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve institutions.' });
  }
};
