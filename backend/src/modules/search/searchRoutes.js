const express = require('express');
const router = express.Router();
const { query } = require('../../database/db');

// GET /api/v1/search (Universal Cross-Module Search)
router.get('/', async (req, res) => {
  try {
    const { q = '', module = 'all', location = 'all', limit = 25 } = req.query;
    const term = `%${q.trim()}%`;
    const results = [];

    // Search Advertisements
    if (module === 'all' || module === 'advertisements') {
      try {
        const ads = await query(
          `SELECT id, title, slug, description, image_url, location, 'advertisement' AS result_type,
                  'Advertisements' AS module_name, '/advertisements/' AS route_prefix
           FROM advertisements
           WHERE status = 'approved' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)
           LIMIT 10`,
          [term, term, term]
        );
        results.push(...(ads || []));
      } catch (e) {}
    }

    // Search Businesses
    if (module === 'all' || module === 'businesses') {
      try {
        const businesses = await query(
          `SELECT id, name AS title, slug, description, logo_url AS image_url, locality AS location,
                  'business' AS result_type, 'Verified Businesses' AS module_name, '/businesses/' AS route_prefix
           FROM businesses
           WHERE status = 'approved' AND (name LIKE ? OR description LIKE ? OR locality LIKE ?)
           LIMIT 10`,
          [term, term, term]
        );
        results.push(...(businesses || []));
      } catch (e) {}
    }

    // Search Rental Items
    if (module === 'all' || module === 'rentals') {
      try {
        const rentals = await query(
          `SELECT id, title, slug, description, location, daily_rate,
                  'rental' AS result_type, 'Rent Items' AS module_name, '/rentals/' AS route_prefix
           FROM rental_items
           WHERE status = 'approved' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)
           LIMIT 10`,
          [term, term, term]
        );
        results.push(...(rentals || []));
      } catch (e) {}
    }

    // Search Events
    if (module === 'all' || module === 'events') {
      try {
        const events = await query(
          `SELECT id, title, slug, description, venue AS location, banner_url AS image_url,
                  'event' AS result_type, 'Events' AS module_name, '/events/' AS route_prefix
           FROM events
           WHERE status = 'approved' AND (title LIKE ? OR description LIKE ? OR venue LIKE ?)
           LIMIT 10`,
          [term, term, term]
        );
        results.push(...(events || []));
      } catch (e) {}
    }

    // Search Jobs
    if (module === 'all' || module === 'jobs') {
      try {
        const jobs = await query(
          `SELECT id, title, slug, description, location, company_name,
                  'job' AS result_type, 'Jobs' AS module_name, '/jobs/' AS route_prefix
           FROM job_listings
           WHERE status = 'approved' AND (title LIKE ? OR company_name LIKE ? OR description LIKE ?)
           LIMIT 10`,
          [term, term, term]
        );
        results.push(...(jobs || []));
      } catch (e) {}
    }

    // Search Properties
    if (module === 'all' || module === 'properties') {
      try {
        const properties = await query(
          `SELECT id, title, slug, description, location, monthly_rent,
                  'property' AS result_type, 'Properties' AS module_name, '/properties/' AS route_prefix
           FROM properties
           WHERE status = 'approved' AND (title LIKE ? OR description LIKE ? OR location LIKE ?)
           LIMIT 10`,
          [term, term, term]
        );
        results.push(...(properties || []));
      } catch (e) {}
    }

    res.json({
      success: true,
      query: q,
      total_matches: results.length,
      data: results.slice(0, parseInt(limit, 10))
    });
  } catch (error) {
    console.error('Universal Search Error:', error);
    res.status(500).json({ success: false, message: 'Search processing failed.' });
  }
});

module.exports = router;
