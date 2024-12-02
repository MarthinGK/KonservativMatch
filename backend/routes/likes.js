const express = require('express');
const router = express.Router();
const { addLike, getLikes, getLikedMe } = require('../controllers/likesController');

router.post('/', addLike);
router.get('/', getLikes);
router.get('/liked-me', getLikedMe);

module.exports = router;