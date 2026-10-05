const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Public
router.get('/', bannerController.getBanners);

// Admin
router.get('/admin/list', verifyToken, requireAdmin, bannerController.getAdminBanners);
router.post('/admin/create', verifyToken, requireAdmin, bannerController.createBanner);
router.put('/admin/update/:id', verifyToken, requireAdmin, bannerController.updateBanner);
router.delete('/admin/delete/:id', verifyToken, requireAdmin, bannerController.deleteBanner);

module.exports = router;
