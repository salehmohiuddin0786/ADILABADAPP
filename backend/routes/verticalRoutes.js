const express = require('express');
const router = express.Router();
const controller = require('../controllers/verticalsController');

router.get('/jobs', controller.getJobs);
router.get('/agriculture', controller.getAgriculture);
router.get('/food', controller.getFood);
router.get('/restaurants', controller.getFood);
router.get('/properties', controller.getProperties);
router.get('/weddings', controller.getWeddings);
router.get('/education', controller.getEducation);

module.exports = router;
