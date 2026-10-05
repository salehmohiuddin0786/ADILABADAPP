const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notificationController');
const { verifyToken, requireAdmin, optionalToken } = require('../middleware/authMiddleware');

// Public/User
router.get('/', optionalToken, notifController.getNotifications);
router.post('/read/:id', verifyToken, notifController.markAsRead);

// Admin
router.get('/admin/list', verifyToken, requireAdmin, notifController.getAdminNotifications);
router.post('/admin/create', verifyToken, requireAdmin, notifController.createNotification);
router.delete('/admin/:id', verifyToken, requireAdmin, notifController.deleteNotification);

module.exports = router;
