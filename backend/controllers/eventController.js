const slugify = require('slugify');
const { query } = require('../config/db');
const { logAdminAction } = require('../middleware/auditMiddleware');

// PUBLIC: Get published events
exports.getEvents = async (req, res) => {
  try {
    const { search, location, featured, page = 1, limit = 12 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const params = [];
    const whereConditions = [`e.status = 'published'`];

    if (location) {
      whereConditions.push('(l.slug = ? OR l.id = ?)');
      params.push(location, location);
    }

    if (featured === 'true' || featured === '1') {
      whereConditions.push('e.is_featured = 1');
    }

    if (search && search.trim()) {
      whereConditions.push('(e.title LIKE ? OR e.description LIKE ? OR e.venue LIKE ? OR e.organizer LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`;

    const countResult = await query(
      `SELECT COUNT(*) as total FROM events e
       LEFT JOIN locations l ON e.location_id = l.id
       ${whereClause}`,
      params
    );
    const total = countResult[0]?.total || 0;

    const events = await query(
      `SELECT
        e.id, e.title, e.slug, e.description, e.cover_url, e.event_date,
        e.event_time, e.venue, e.location_id, e.address, e.organizer,
        e.phone, e.whatsapp, e.website, e.registration_url, e.is_featured,
        l.name as location_name, l.slug as location_slug
       FROM events e
       LEFT JOIN locations l ON e.location_id = l.id
       ${whereClause}
       ORDER BY e.event_date ASC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), offset]
    );

    return res.json({
      success: true,
      data: events,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error('getEvents error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch events.' });
  }
};

// PUBLIC: Get event by slug
exports.getEventBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const events = await query(
      `SELECT
        e.*,
        l.name as location_name, l.slug as location_slug, l.pincode
       FROM events e
       LEFT JOIN locations l ON e.location_id = l.id
       WHERE e.slug = ? LIMIT 1`,
      [slug]
    );

    if (!events || events.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }

    const event = events[0];

    // Other upcoming events
    const upcoming = await query(
      `SELECT id, title, slug, cover_url, event_date, event_time, venue
       FROM events
       WHERE id != ? AND status = 'published'
       ORDER BY event_date ASC LIMIT 3`,
      [event.id]
    );
    event.upcoming = upcoming;

    return res.json({ success: true, data: event });
  } catch (error) {
    console.error('getEventBySlug error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch event.' });
  }
};

// ADMIN: Get all events
exports.getAdminEvents = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
    const params = [];
    const whereConditions = [];

    if (status) {
      whereConditions.push('e.status = ?');
      params.push(status);
    }

    if (search && search.trim()) {
      whereConditions.push('(e.title LIKE ? OR e.venue LIKE ? OR e.organizer LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countResult = await query(`SELECT COUNT(*) as total FROM events e ${whereClause}`, params);
    const total = countResult[0]?.total || 0;

    const events = await query(
      `SELECT
        e.id, e.title, e.slug, e.cover_url, e.event_date, e.event_time,
        e.venue, e.organizer, e.phone, e.is_featured, e.status, e.created_at,
        l.name as location_name
       FROM events e
       LEFT JOIN locations l ON e.location_id = l.id
       ${whereClause}
       ORDER BY e.event_date DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit, 10), offset]
    );

    return res.json({
      success: true,
      data: events,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / parseInt(limit, 10))
      }
    });
  } catch (error) {
    console.error('getAdminEvents error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch admin events.' });
  }
};

// ADMIN: Get single event
exports.getAdminEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const events = await query('SELECT * FROM events WHERE id = ? LIMIT 1', [id]);
    if (!events || events.length === 0) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    return res.json({ success: true, data: events[0] });
  } catch (error) {
    console.error('getAdminEventById error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch event.' });
  }
};

// ADMIN ONLY: Create event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      cover_url,
      event_date,
      event_time,
      venue,
      location_id,
      address,
      organizer,
      phone,
      whatsapp,
      website,
      registration_url,
      is_featured = 0,
      status = 'published'
    } = req.body;

    if (!title || !description || !event_date || !event_time || !venue || !address || !organizer) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, date, time, venue, address, and organizer are required.'
      });
    }

    let baseSlug = slugify(title, { lower: true, strict: true }) || 'event';
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existing = await query('SELECT id FROM events WHERE slug = ? LIMIT 1', [slug]);
      if (existing.length === 0) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const result = await query(
      `INSERT INTO events (
        title, slug, description, cover_url, event_date, event_time, venue,
        location_id, address, organizer, phone, whatsapp, website,
        registration_url, is_featured, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        slug,
        description.trim(),
        cover_url || null,
        event_date,
        event_time.trim(),
        venue.trim(),
        location_id ? parseInt(location_id, 10) : null,
        address.trim(),
        organizer.trim(),
        phone ? phone.trim() : null,
        whatsapp ? whatsapp.trim() : null,
        website ? website.trim() : null,
        registration_url ? registration_url.trim() : null,
        is_featured ? 1 : 0,
        status
      ]
    );

    const eventId = result.insertId;
    await logAdminAction(req.user.id, 'Event created', 'event', eventId, { title, slug }, req);

    return res.status(201).json({ success: true, message: 'Event created successfully.', data: { id: eventId, slug } });
  } catch (error) {
    console.error('createEvent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create event.' });
  }
};

// ADMIN ONLY: Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      cover_url,
      event_date,
      event_time,
      venue,
      location_id,
      address,
      organizer,
      phone,
      whatsapp,
      website,
      registration_url,
      is_featured,
      status
    } = req.body;

    await query(
      `UPDATE events SET
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        cover_url = COALESCE(?, cover_url),
        event_date = COALESCE(?, event_date),
        event_time = COALESCE(?, event_time),
        venue = COALESCE(?, venue),
        location_id = COALESCE(?, location_id),
        address = COALESCE(?, address),
        organizer = COALESCE(?, organizer),
        phone = ?,
        whatsapp = ?,
        website = ?,
        registration_url = ?,
        is_featured = COALESCE(?, is_featured),
        status = COALESCE(?, status)
       WHERE id = ?`,
      [
        title ? title.trim() : null,
        description ? description.trim() : null,
        cover_url || null,
        event_date || null,
        event_time ? event_time.trim() : null,
        venue ? venue.trim() : null,
        location_id ? parseInt(location_id, 10) : null,
        address ? address.trim() : null,
        organizer ? organizer.trim() : null,
        phone !== undefined ? phone : null,
        whatsapp !== undefined ? whatsapp : null,
        website !== undefined ? website : null,
        registration_url !== undefined ? registration_url : null,
        is_featured !== undefined ? (is_featured ? 1 : 0) : null,
        status || null,
        id
      ]
    );

    await logAdminAction(req.user.id, 'Event edited', 'event', id, { title }, req);

    return res.json({ success: true, message: 'Event updated successfully.' });
  } catch (error) {
    console.error('updateEvent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update event.' });
  }
};

// ADMIN ONLY: Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM events WHERE id = ?', [id]);
    await logAdminAction(req.user.id, 'Event deleted', 'event', id, {}, req);
    return res.json({ success: true, message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('deleteEvent error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete event.' });
  }
};
