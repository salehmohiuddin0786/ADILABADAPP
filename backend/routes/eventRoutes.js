const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Public
router.get('/', eventController.getEvents);
router.get('/detail/:slug', eventController.getEventBySlug);

// Admin-only management
router.get('/admin/list', verifyToken, requireAdmin, eventController.getAdminEvents);
router.get('/admin/item/:id', verifyToken, requireAdmin, eventController.getAdminEventById);
router.post('/admin/create', verifyToken, requireAdmin, eventController.createEvent);
router.put('/admin/update/:id', verifyToken, requireAdmin, eventController.updateEvent);
router.delete('/admin/delete/:id', verifyToken, requireAdmin, eventController.deleteEvent);

module.exports = router;
