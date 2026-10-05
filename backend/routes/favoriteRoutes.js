const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { verifyToken } = require('../middleware/authMiddleware');

// Logged-in users only
router.use(verifyToken);

router.get('/', favoriteController.getFavorites);
router.post('/', favoriteController.toggleFavorite);
router.get('/check', favoriteController.checkFavorite);
router.delete('/:id', favoriteController.removeFavorite);

module.exports = router;
