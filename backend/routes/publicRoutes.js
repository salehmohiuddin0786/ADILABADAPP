const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const settingController = require('../controllers/settingController');
const { query } = require('../config/db');

router.get('/search', searchController.globalSearch);
router.get('/locations', searchController.getLocations);
router.get('/settings', settingController.getSettings);

router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ success: false, message: 'Name and message are required.' });
    }

    // Save as admin notification
    await query(
      `INSERT INTO notifications (title, message, type, target_type, link_url)
       VALUES (?, ?, 'system', 'admin', '/admin')`,
      [
        `New Inquiry: ${subject || 'General Contact'}`,
        `From: ${name} (${email || phone || 'Anonymous'})\nMessage: ${message}`
      ]
    );

    return res.json({
      success: true,
      message: 'Thank you! Your inquiry has been delivered to Adilabad App support desk.'
    });
  } catch (err) {
    console.error('Contact inquiry error:', err);
    return res.status(500).json({ success: false, message: 'Failed to deliver message.' });
  }
});

module.exports = router;
