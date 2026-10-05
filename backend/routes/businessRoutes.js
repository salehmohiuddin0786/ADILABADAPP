const express = require('express');
const router = express.Router();
const bizController = require('../controllers/businessController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Public
router.get('/', bizController.getBusinesses);
router.get('/detail/:slug', bizController.getBusinessBySlug);

// Admin-only management
router.get('/admin/list', verifyToken, requireAdmin, bizController.getAdminBusinesses);
router.get('/admin/item/:id', verifyToken, requireAdmin, bizController.getAdminBusinessById);
router.post('/admin/create', verifyToken, requireAdmin, bizController.createBusiness);
router.put('/admin/update/:id', verifyToken, requireAdmin, bizController.updateBusiness);
router.delete('/admin/delete/:id', verifyToken, requireAdmin, bizController.deleteBusiness);

module.exports = router;
