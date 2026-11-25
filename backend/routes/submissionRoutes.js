const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

// Public or filtered list
router.get('/', submissionController.getSubmissions);
router.get('/counts', submissionController.getCounts);

// Authenticated owner creates submission
router.post('/', verifyToken, submissionController.createSubmission);

// Admin or Staff moderation actions
router.patch('/:id/moderate', verifyToken, requireAdmin, submissionController.moderateSubmission);
router.delete('/:id', verifyToken, requireAdmin, submissionController.deleteSubmission);

module.exports = router;
