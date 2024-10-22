const express = require('express');
const router = express.Router();
const { getProfilePhotosByProfileId, getProfilePhotos } = require('../controllers/photosController');

// Route to fetch profile photos by profile ID
router.get('/profile/:profileId/photos', getProfilePhotosByProfileId);

// Route to fetch profile photos by user ID
router.get('/:userId/photos', getProfilePhotos);

module.exports = router;