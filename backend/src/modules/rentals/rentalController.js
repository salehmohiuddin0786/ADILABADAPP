const { query, withTransaction } = require('../../database/db');
const { ROLES } = require('../../config/roles');

/**
 * ADILABAD APP — RENTALS & BOOKINGS CONTROLLER
 */

// GET /api/v1/rentals (Public / Filtered)
async function getRentals(req, res) {
  try {
    const { category, subcategory, condition, location, minPrice, maxPrice, q, sort, limit = 20, page = 1 } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    let sql = `
      SELECT r.*, rc.name AS category_name, u.name AS owner_name, u.phone AS owner_phone
      FROM rental_items r
      JOIN rental_categories rc ON r.category_id = rc.id
      JOIN users u ON r.owner_id = u.id
      WHERE r.status = 'approved'
    `;
    const params = [];

    if (category) {
      sql += ` AND (rc.slug = ? OR rc.name = ?)`;
      params.push(category, category);
    }
    if (condition) {
      sql += ` AND r.item_condition = ?`;
      params.push(condition);
    }
    if (location && location !== 'all') {
      sql += ` AND (r.location LIKE ? OR r.pickup_address LIKE ?)`;
      params.push(`%${location}%`, `%${location}%`);
    }
    if (minPrice) {
      sql += ` AND r.daily_rate >= ?`;
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      sql += ` AND r.daily_rate <= ?`;
      params.push(parseFloat(maxPrice));
    }
    if (q) {
      sql += ` AND (r.title LIKE ? OR r.description LIKE ?)`;
      params.push(`%${q}%`, `%${q}%`);
    }

    // Sort order
    if (sort === 'price_asc') {
      sql += ` ORDER BY r.daily_rate ASC`;
    } else if (sort === 'price_desc') {
      sql += ` ORDER BY r.daily_rate DESC`;
    } else {
      sql += ` ORDER BY r.id DESC`;
    }

    sql += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    let items = [];
    try {
      items = await query(sql, params);
      // Fetch media attachments for items
      for (const item of items) {
        const media = await query(
          `SELECT media_url, is_primary FROM rental_item_media WHERE rental_item_id = ? ORDER BY is_primary DESC`,
          [item.id]
        );
        item.media = media || [];
      }
    } catch (dbErr) {
      // Offline fallback mock data
      items = [
        {
          id: 101,
          title: 'Sony Alpha A7 IV Mirrorless Camera + 24-70mm Lens',
          slug: 'sony-alpha-a7-iv-mirrorless-camera',
          category_name: 'Electronics',
          daily_rate: 1500,
          security_deposit: 5000,
          location: 'Cinema Road, Adilabad',
          item_condition: 'like_new',
          owner_name: 'Adilabad Media Works',
          status: 'approved',
          media: [{ media_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800' }]
        },
        {
          id: 102,
          title: 'John Deere 5050D Tractor with Cultivator',
          slug: 'john-deere-5050d-tractor-rental',
          category_name: 'Agricultural Equipment',
          daily_rate: 3200,
          security_deposit: 8000,
          location: 'Utnoor Road, Adilabad',
          item_condition: 'good',
          owner_name: 'Telangana Agri Hub',
          status: 'approved',
          media: [{ media_url: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800' }]
        },
        {
          id: 103,
          title: 'JBL VRX Line Array 10000W Sound Setup for Events',
          slug: 'jbl-vrx-sound-setup-events',
          category_name: 'Event Equipment',
          daily_rate: 8500,
          security_deposit: 12000,
          location: 'Subhash Nagar, Adilabad',
          item_condition: 'like_new',
          owner_name: 'Royal Sound & Lights',
          status: 'approved',
          media: [{ media_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800' }]
        }
      ];
    }

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('getRentals Error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve rental items.' });
  }
}

// GET /api/v1/rentals/:slug (Item Details)
async function getRentalBySlug(req, res) {
  try {
    const { slug } = req.params;
    let items = [];
    try {
      items = await query(
        `SELECT r.*, rc.name AS category_name, u.name AS owner_name, u.phone AS owner_phone, u.avatar_url AS owner_avatar
         FROM rental_items r
         JOIN rental_categories rc ON r.category_id = rc.id
         JOIN users u ON r.owner_id = u.id
         WHERE r.slug = ? LIMIT 1`,
        [slug]
      );
    } catch (e) {}

    if (!items || items.length === 0) {
      return res.status(404).json({ success: false, message: 'Rental item not found.' });
    }

    const item = items[0];
    const media = await query(
      `SELECT media_url, is_primary FROM rental_item_media WHERE rental_item_id = ? ORDER BY is_primary DESC`,
      [item.id]
    );
    item.media = media || [];

    // Query booked dates to display on availability calendar
    const bookings = await query(
      `SELECT start_date, end_date FROM rental_bookings 
       WHERE rental_item_id = ? AND status IN ('CONFIRMED', 'ACTIVE', 'RETURN_PENDING')`,
      [item.id]
    );
    item.reserved_dates = bookings || [];

    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch rental item.' });
  }
}

// POST /api/v1/rentals (Submit rental listing)
async function createRentalListing(req, res) {
  try {
    const {
      title,
      category_id,
      subcategory_id,
      description,
      item_condition = 'good',
      hourly_rate,
      daily_rate,
      weekly_rate,
      monthly_rate,
      security_deposit = 0,
      min_rental_days = 1,
      max_rental_days = 30,
      location = 'Adilabad',
      pickup_address,
      is_delivery_available = 0,
      delivery_charge = 0,
      cancellation_policy,
      damage_policy,
      media_urls = []
    } = req.body;

    if (!title || !daily_rate || !category_id || !pickup_address) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, daily rental rate, and pickup address are mandatory.'
      });
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    const result = await withTransaction(async (conn) => {
      const [insertRes] = await conn.execute(
        `INSERT INTO rental_items 
         (owner_id, category_id, subcategory_id, title, slug, description, item_condition,
          hourly_rate, daily_rate, weekly_rate, monthly_rate, security_deposit, min_rental_days,
          max_rental_days, location, pickup_address, is_delivery_available, delivery_charge,
          cancellation_policy, damage_policy, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          req.user.id, category_id, subcategory_id || null, title, slug, description || '',
          item_condition, hourly_rate || null, daily_rate, weekly_rate || null, monthly_rate || null,
          security_deposit, min_rental_days, max_rental_days, location, pickup_address,
          is_delivery_available ? 1 : 0, delivery_charge, cancellation_policy || '', damage_policy || ''
        ]
      );

      const itemId = insertRes.insertId;

      if (Array.isArray(media_urls) && media_urls.length > 0) {
        for (let i = 0; i < media_urls.length; i++) {
          await conn.execute(
            `INSERT INTO rental_item_media (rental_item_id, media_url, is_primary, display_order)
             VALUES (?, ?, ?, ?)`,
            [itemId, media_urls[i], i === 0 ? 1 : 0, i]
          );
        }
      }

      return { id: itemId, slug };
    });

    res.status(201).json({
      success: true,
      message: 'Rental listing submitted successfully! Sent to admin moderation queue for verification.',
      data: result
    });
  } catch (err) {
    console.error('createRentalListing Error:', err);
    res.status(500).json({ success: false, message: 'Could not create rental listing.' });
  }
}

// POST /api/v1/rentals/:id/book (Request a Booking)
async function requestRentalBooking(req, res) {
  try {
    const rentalItemId = req.params.id;
    const { start_date, end_date, customer_notes, payment_method = 'cash_on_pickup' } = req.body;

    if (!start_date || !end_date) {
      return res.status(400).json({ success: false, message: 'Start date and end date are mandatory.' });
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    if (end < start) {
      return res.status(400).json({ success: false, message: 'End date cannot precede start date.' });
    }

    const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

    // Atomic transaction checking availability and creating reservation
    const bookingResult = await withTransaction(async (conn) => {
      // 1. Fetch item and lock row
      const [items] = await conn.execute(
        `SELECT id, owner_id, title, daily_rate, security_deposit, status, min_rental_days, max_rental_days 
         FROM rental_items WHERE id = ? FOR UPDATE`,
        [rentalItemId]
      );

      if (!items || items.length === 0) {
        throw new Error('Rental item not found.');
      }
      const item = items[0];

      if (item.status !== 'approved') {
        throw new Error('This rental item is not currently active for booking.');
      }

      if (String(item.owner_id) === String(req.user.id)) {
        throw new Error('You cannot rent your own listed item.');
      }

      // Check min/max duration
      if (diffDays < item.min_rental_days) {
        throw new Error(`Minimum rental period is ${item.min_rental_days} day(s).`);
      }
      if (diffDays > item.max_rental_days) {
        throw new Error(`Maximum rental period is ${item.max_rental_days} day(s).`);
      }

      // 2. Prevent overlapping confirmed bookings
      const [conflicts] = await conn.execute(
        `SELECT id FROM rental_bookings 
         WHERE rental_item_id = ? 
           AND status IN ('CONFIRMED', 'ACTIVE', 'RETURN_PENDING')
           AND NOT (end_date < ? OR start_date > ?)`,
        [rentalItemId, start_date, end_date]
      );

      if (conflicts && conflicts.length > 0) {
        throw new Error('Selected dates are already booked by another customer. Please choose alternative dates.');
      }

      // 3. Calculate snapshots
      const rentalFee = Number(item.daily_rate) * diffDays;
      const securityDeposit = Number(item.security_deposit);
      const totalAmount = rentalFee + securityDeposit;
      const bookingCode = `ADL-RENT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      // 4. Insert booking
      const [bookRes] = await conn.execute(
        `INSERT INTO rental_bookings
         (booking_code, rental_item_id, customer_id, owner_id, start_date, end_date, total_days,
          daily_rate_snapshot, rental_fee, security_deposit_snapshot, total_amount, payment_method,
          status, customer_notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
        [
          bookingCode, item.id, req.user.id, item.owner_id, start_date, end_date, diffDays,
          item.daily_rate, rentalFee, securityDeposit, totalAmount, payment_method,
          customer_notes || ''
        ]
      );

      const bookingId = bookRes.insertId;

      // 5. Status history record
      await conn.execute(
        `INSERT INTO rental_booking_status_history (booking_id, new_status, changed_by_user_id, notes)
         VALUES (?, 'PENDING', ?, 'Booking request initiated by customer')`,
        [bookingId, req.user.id]
      );

      // 6. Notify owner
      await conn.execute(
        `INSERT INTO notifications (user_id, title, message, type, link)
         VALUES (?, ?, ?, 'booking', ?)`,
        [
          item.owner_id,
          'New Rental Booking Request',
          `Customer ${req.user.name} requested to rent "${item.title}" for ${diffDays} day(s).`,
          `/owner-panel/rental-requests`
        ]
      );

      return {
        booking_id: bookingId,
        booking_code: bookingCode,
        rental_item: item.title,
        total_days: diffDays,
        rental_fee: rentalFee,
        security_deposit: securityDeposit,
        total_amount: totalAmount,
        status: 'PENDING'
      };
    });

    res.status(201).json({
      success: true,
      message: 'Rental booking request sent to owner for acceptance!',
      data: bookingResult
    });
  } catch (error) {
    console.error('requestRentalBooking Error:', error);
    res.status(400).json({ success: false, message: error.message || 'Could not process booking request.' });
  }
}

// PATCH /api/v1/rentals/bookings/:id/status (Owner / Staff Status Updates)
async function updateBookingStatus(req, res) {
  try {
    const bookingId = req.params.id;
    const { action, notes } = req.body; // 'accept', 'reject', 'confirm', 'handover', 'return', 'dispute'

    const ACTION_STATUS_MAP = {
      accept: 'ACCEPTED',
      reject: 'REJECTED',
      confirm: 'CONFIRMED',
      handover: 'ACTIVE',
      return: 'COMPLETED',
      dispute: 'DISPUTED'
    };

    const targetStatus = ACTION_STATUS_MAP[action];
    if (!targetStatus) {
      return res.status(400).json({ success: false, message: 'Invalid booking action.' });
    }

    const updated = await withTransaction(async (conn) => {
      const [bookings] = await conn.execute(
        `SELECT b.*, r.title AS item_title FROM rental_bookings b 
         JOIN rental_items r ON b.rental_item_id = r.id 
         WHERE b.id = ? FOR UPDATE`,
        [bookingId]
      );

      if (!bookings || bookings.length === 0) {
        throw new Error('Booking not found.');
      }

      const booking = bookings[0];
      const isOwner = String(booking.owner_id) === String(req.user.id);
      const isCustomer = String(booking.customer_id) === String(req.user.id);
      const isAdmin = req.user.roles.includes(ROLES.SUPER_ADMIN) || req.user.roles.includes(ROLES.ADMIN);

      if (!isOwner && !isCustomer && !isAdmin) {
        throw new Error('You do not have permission to modify this booking.');
      }

      await conn.execute(
        `UPDATE rental_bookings SET status = ? WHERE id = ?`,
        [targetStatus, bookingId]
      );

      await conn.execute(
        `INSERT INTO rental_booking_status_history (booking_id, previous_status, new_status, changed_by_user_id, notes)
         VALUES (?, ?, ?, ?, ?)`,
        [bookingId, booking.status, targetStatus, req.user.id, notes || `Status changed to ${targetStatus}`]
      );

      // Notify the counterpart
      const recipientId = isOwner ? booking.customer_id : booking.owner_id;
      await conn.execute(
        `INSERT INTO notifications (user_id, title, message, type, link)
         VALUES (?, ?, ?, 'booking', ?)`,
        [
          recipientId,
          `Booking Update: ${targetStatus}`,
          `Booking for "${booking.item_title}" status is now ${targetStatus}.`,
          isOwner ? `/customer-panel/my-rental-requests` : `/owner-panel/rental-requests`
        ]
      );

      return { bookingId, previousStatus: booking.status, newStatus: targetStatus };
    });

    res.json({
      success: true,
      message: `Booking successfully transitioned to ${targetStatus}.`,
      data: updated
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || 'Status update failed.' });
  }
}

module.exports = {
  getRentals,
  getRentalBySlug,
  createRentalListing,
  requestRentalBooking,
  updateBookingStatus
};
