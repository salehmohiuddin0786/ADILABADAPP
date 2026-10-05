const express = require('express');
const router = express.Router();
const adController = require('../controllers/advertisementController');
const { verifyToken, requireAdmin, optionalToken } = require('../middleware/authMiddleware');

// Public routes
router.get('/', adController.getAdvertisements);
router.get('/detail/:slug', optionalToken, adController.getAdvertisementBySlug);
router.post('/:id/click', adController.trackClick);

// Admin-only management routes (strictly protected by verifyToken + requireAdmin)
router.get('/admin/list', verifyToken, requireAdmin, adController.getAdminAdvertisements);
router.get('/admin/item/:id', verifyToken, requireAdmin, adController.getAdminAdvertisementById);
router.post('/admin/create', verifyToken, requireAdmin, adController.createAdvertisement);
router.put('/admin/update/:id', verifyToken, requireAdmin, adController.updateAdvertisement);
router.delete('/admin/delete/:id', verifyToken, requireAdmin, adController.deleteAdvertisement);
router.patch('/admin/:id/status', verifyToken, requireAdmin, adController.toggleStatus);
router.patch('/admin/:id/feature', verifyToken, requireAdmin, adController.toggleFeatured);

module.exports = router;
