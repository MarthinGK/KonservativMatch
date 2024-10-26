const express = require('express');
const multer = require('multer'); // Import multer
const router = express.Router();
const { addProfilePhotos, addProfilePhoto, getProfilePhotosByProfileId, getProfilePhotos, deleteProfilePhoto } = require('../controllers/photosController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage }); // Define upload using the storage configuration

// Route to fetch profile photos by profile ID
router.get('/profile/:profileId/photos', getProfilePhotosByProfileId);

// Route to fetch profile photos by user ID
// router.get('/:userId/photos', getProfilePhotos);

//router.post('/upload', upload.array('photos', 6), addProfilePhotos);  // Maximum 6 photos
router.post('/upload', upload.single('file'), addProfilePhoto); // Maximum 6 photos

router.get('/:user_id', getProfilePhotos);

router.delete('/delete', deleteProfilePhoto);

module.exports = router;
