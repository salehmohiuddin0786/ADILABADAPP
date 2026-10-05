const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const userController = require('../controllers/userController');
const settingController = require('../controllers/settingController');
const upload = require('../middleware/uploadMiddleware');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// All admin routes strictly require valid JWT with admin role
router.use(verifyToken, requireAdmin);

// Analytics
router.get('/analytics/overview', analyticsController.getOverviewStats);

// Users Management
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.patch('/users/:id/status', userController.toggleUserStatus);

// Settings & Audit Logs
router.get('/settings', settingController.getSettings);
router.put('/settings', settingController.updateSettings);
router.get('/audit-logs', settingController.getAuditLogs);

// Image Upload API (Multi-file or Single file with MIME & extension security)
router.post('/upload', upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded.' });
    }

    const uploadedUrls = req.files.map(file => {
      return `/uploads/${file.filename}`;
    });

    return res.json({
      success: true,
      message: `${uploadedUrls.length} file(s) uploaded successfully.`,
      urls: uploadedUrls
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: 'File upload failed.' });
  }
});

module.exports = router;
