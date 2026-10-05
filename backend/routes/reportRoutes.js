const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, requireAdmin, optionalToken } = require('../middleware/authMiddleware');

// Public/User submit report
router.post('/', optionalToken, reportController.createReport);

// Admin review reports
router.get('/admin/list', verifyToken, requireAdmin, reportController.getAdminReports);
router.patch('/admin/:id', verifyToken, requireAdmin, reportController.updateReportStatus);

module.exports = router;
