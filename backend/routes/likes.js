const express = require('express');
const router = express.Router();
const { getLikes, getLikedMe, checkLikeStatus, toggleLike, dislikeUser, getMatches } = require('../controllers/likesController');

router.get('/liked-by', getLikes);
router.get('/liked-me', getLikedMe);
router.get('/status', checkLikeStatus); // Check like status
router.post('/toggle', toggleLike); // Toggle like
router.post('/dislike', dislikeUser);
router.get('/matches', getMatches); 

module.exports = router;