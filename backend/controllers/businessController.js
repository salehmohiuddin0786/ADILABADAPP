const slugify = require('slugify');
const { query } = require('../config/db');
const { logAdminAction } = require('../middleware/auditMiddleware');
const importService = require('../services/businessImportService');

// PUBLIC: Get businesses
exports.getBusinesses = async (req, res) => {
  try {
    const { category, location, search, featured, district, city, page = 1, limit = 12 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const params = [];
    const whereConditions = ['b.is_active = 1'];

    if (category) {
      whereConditions.push('(c.slug = ? OR c.id = ?)');
      params.push(category, category);
    }

    if (location) {
      whereConditions.push('(l.slug = ? OR l.id = ? OR b.locality = ?)');
      params.push(location, location, location);
    }

    if (district && district.trim()) {
      whereConditions.push('(b.district = ? OR b.district LIKE ?)');
      params.push(district.trim(), `%${district.trim()}%`);
    }

    if (city && city.trim()) {
      whereConditions.push('(b.city = ? OR b.city LIKE ?)');
      params.push(city.trim(), `%${city.trim()}%`);
    }

    if (featured === 'true' || featured === '1') {
      whereConditions.push('b.is_featured = 1');
    }

    if (search && search.trim()) {
      whereConditions.push('(b.name LIKE ? OR b.description LIKE ? OR c.name LIKE ? OR l.name LIKE ? OR b.locality LIKE ? OR b.district LIKE ? OR b.city LIKE ? OR b.phone LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term, term, term, term);
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
        b.id, b.name, b.slug, b.category_id, b.subcategory, b.location_id, b.address,
        b.locality, b.city, b.district, b.state, b.pincode, b.latitude, b.longitude, b.maps_url,
        b.phone, b.alternate_phone, b.whatsapp, b.email, b.website, b.description,
        b.logo_url, b.cover_url, b.rating, b.total_reviews, b.is_featured, b.status,
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
      whereConditions.push('(b.name LIKE ? OR b.phone LIKE ? OR b.locality LIKE ? OR b.city LIKE ? OR c.name LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term, term);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countResult = await query(
      `SELECT COUNT(*) as total FROM businesses b
       LEFT JOIN categories c ON b.category_id = c.id
       ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    const businesses = await query(
      `SELECT
        b.id, b.name, b.slug, b.category_id, b.subcategory, b.location_id, b.address,
        b.locality, b.city, b.district, b.state, b.pincode, b.latitude, b.longitude, b.maps_url,
        b.phone, b.alternate_phone, b.whatsapp, b.email, b.website, b.rating, b.is_featured,
        b.is_active, b.status, b.created_at,
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

// ==========================================
// BULK IMPORT CONTROLLERS (ADMIN ONLY)
// ==========================================

// 1. Download Sample Excel Template
exports.downloadImportTemplate = async (req, res) => {
  try {
    const buffer = importService.generateSampleTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Adilabad_Business_Import_Template.xlsx"');
    res.setHeader('Content-Length', buffer.length);
    return res.send(buffer);
  } catch (error) {
    console.error('downloadImportTemplate error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate Excel template.' });
  }
};

// 2. Upload and Preview
exports.previewImport = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'No spreadsheet file uploaded. Please upload a .xlsx, .xls, or .csv file.'
      });
    }

    const previewData = await importService.parseAndPreview(req.file.buffer, req.file.originalname);
    return res.json({
      success: true,
      message: `Parsed ${previewData.totalRecords} records (${previewData.validRecords} valid, ${previewData.duplicateRecords} duplicates, ${previewData.invalidRecords} invalid).`,
      data: previewData
    });
  } catch (error) {
    console.error('previewImport error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to process Excel file. Please ensure it is a valid spreadsheet.'
    });
  }
};

// 3. Execute Bulk Import
exports.executeImport = async (req, res) => {
  try {
    const { records, duplicateStrategy = 'skip', fileName } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No records provided for bulk import.'
      });
    }

    if (!['skip', 'update', 'import_all'].includes(duplicateStrategy)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid duplicate strategy. Allowed values: "skip", "update", "import_all".'
      });
    }

    const result = await importService.executeBulkImport({
      records,
      duplicateStrategy,
      fileName: fileName || 'bulk_import.xlsx',
      user: req.user
    });

    await logAdminAction(
      req.user.id,
      'Business bulk import executed',
      'business_import',
      result.importId,
      {
        fileName,
        total: result.total,
        imported: result.imported,
        updated: result.updated,
        skipped: result.skipped,
        failed: result.failed
      },
      req
    );

    return res.json({
      success: true,
      message: `Import processed successfully: ${result.imported} new imported, ${result.updated} updated, ${result.skipped} skipped duplicates, ${result.failed} failed.`,
      data: result
    });
  } catch (error) {
    console.error('executeImport error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to execute bulk business import.'
    });
  }
};

// 4. Retrieve Import History
exports.getImportHistory = async (req, res) => {
  try {
    const imports = await query(`
      SELECT
        id, file_name, uploaded_by, uploader_name, total_records,
        successful_records, updated_records, skipped_records, failed_records,
        status, duplicate_strategy, created_at,
        CASE WHEN failed_records > 0 THEN 1 ELSE 0 END as has_failures
      FROM business_imports
      ORDER BY created_at DESC
      LIMIT 50
    `);

    return res.json({
      success: true,
      data: imports
    });
  } catch (error) {
    console.error('getImportHistory error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve import history.' });
  }
};

// 5. Download Failed Records Excel
exports.downloadFailedRecords = async (req, res) => {
  try {
    const { id } = req.params;
    const records = await query(
      'SELECT id, file_name, failed_data FROM business_imports WHERE id = ? LIMIT 1',
      [id]
    );

    if (!records || records.length === 0) {
      return res.status(404).json({ success: false, message: 'Import history record not found.' });
    }

    const importRecord = records[0];
    let failedList = [];
    if (importRecord.failed_data) {
      try {
        failedList = JSON.parse(importRecord.failed_data);
      } catch (e) {
        failedList = [];
      }
    }

    if (!Array.isArray(failedList) || failedList.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No failed records exist for this import session.'
      });
    }

    const buffer = importService.generateFailedRecordsExcel(failedList);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="Failed_Records_Import_${id}.xlsx"`);
    res.setHeader('Content-Length', buffer.length);
    return res.send(buffer);
  } catch (error) {
    console.error('downloadFailedRecords error:', error);
    return res.status(500).json({ success: false, message: 'Failed to download failed records Excel.' });
  }
};
