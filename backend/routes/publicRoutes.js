const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const settingController = require('../controllers/settingController');

router.get('/search', searchController.globalSearch);
router.get('/locations', searchController.getLocations);
router.get('/settings', settingController.getSettings);

module.exports = router;
