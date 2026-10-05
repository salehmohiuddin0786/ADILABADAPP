const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Public
router.get('/', categoryController.getCategories);
router.get('/detail/:slug', categoryController.getCategoryBySlug);

// Admin
router.get('/admin/list', verifyToken, requireAdmin, categoryController.getAdminCategories);
router.post('/admin/create', verifyToken, requireAdmin, categoryController.createCategory);
router.put('/admin/update/:id', verifyToken, requireAdmin, categoryController.updateCategory);
router.delete('/admin/delete/:id', verifyToken, requireAdmin, categoryController.deleteCategory);

module.exports = router;
