const express = require('express');
const router = express.Router();
const { LOCATIONS_CONFIG, getAllLocalities } = require('../../config/locations');

// GET /api/v1/locations/districts
router.get('/districts', (req, res) => {
  res.json({
    success: true,
    data: LOCATIONS_CONFIG.DISTRICTS.map(d => ({ id: d.id, name: d.name, state: d.state, is_primary: d.is_primary }))
  });
});

// GET /api/v1/locations/towns
router.get('/towns', (req, res) => {
  const districtName = req.query.district || 'Adilabad';
  const district = LOCATIONS_CONFIG.DISTRICTS.find(d => d.name.toLowerCase() === districtName.toLowerCase()) || LOCATIONS_CONFIG.DISTRICTS[0];
  res.json({
    success: true,
    district: district.name,
    data: district.towns
  });
});

// GET /api/v1/locations/localities
router.get('/localities', (req, res) => {
  const districtName = req.query.district || 'Adilabad';
  const localities = getAllLocalities(districtName);
  res.json({
    success: true,
    data: localities
  });
});

module.exports = router;
