const express = require('express');
const router = express.Router();
const { getLikes, getLikedMe, checkLikeStatus, toggleLike } = require('../controllers/likesController');

router.get('/liked-by', getLikes);
router.get('/liked-me', getLikedMe);
router.get('/status', checkLikeStatus); // Check like status
router.post('/toggle', toggleLike); // Toggle like

module.exports = router;