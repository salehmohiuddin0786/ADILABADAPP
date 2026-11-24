const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bizController = require('../controllers/businessController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Multer memory storage configuration for Excel and CSV bulk import
const uploadExcel = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024 // 25 MB max file size
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowed = ['.xlsx', '.xls', '.csv'];
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only Excel (.xlsx, .xls) and CSV (.csv) files are permitted.'), false);
    }
  }
});

// Public
router.get('/', bizController.getBusinesses);
router.get('/detail/:slug', bizController.getBusinessBySlug);

// Admin-only management
router.get('/admin/list', verifyToken, requireAdmin, bizController.getAdminBusinesses);
router.get('/admin/item/:id', verifyToken, requireAdmin, bizController.getAdminBusinessById);
router.post('/admin/create', verifyToken, requireAdmin, bizController.createBusiness);
router.put('/admin/update/:id', verifyToken, requireAdmin, bizController.updateBusiness);
router.delete('/admin/delete/:id', verifyToken, requireAdmin, bizController.deleteBusiness);

// Bulk Import Endpoints (Admin only)
router.get('/admin/import/template', verifyToken, requireAdmin, bizController.downloadImportTemplate);
router.post('/admin/import/preview', verifyToken, requireAdmin, uploadExcel.single('file'), bizController.previewImport);
router.post('/admin/import/execute', verifyToken, requireAdmin, bizController.executeImport);
router.get('/admin/import/history', verifyToken, requireAdmin, bizController.getImportHistory);
router.get('/admin/import/failed/:id', verifyToken, requireAdmin, bizController.downloadFailedRecords);

module.exports = router;
