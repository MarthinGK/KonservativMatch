const express = require('express');
const multer = require('multer'); // Import multer
const router = express.Router();
const { 
      addProfilePhoto, 
      getProfilePhotosByProfileId, 
      getProfilePhotos, 
      deleteProfilePhoto, 
      updatePhotoOrder
    } = require('../controllers/photosController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage for direct buffer access
  limits: { fileSize: 15 * 1024 * 1024 }, // Optional: Limit file size to 5MB
});

// Route to fetch profile photos by profile ID
router.get('/profile/:profileId/photos', getProfilePhotosByProfileId);

// Route to fetch profile photos by user ID
// router.get('/:userId/photos', getProfilePhotos);

//router.post('/upload', upload.array('photos', 6), addProfilePhotos);  // Maximum 6 photos
router.post('/upload', upload.single('file'), addProfilePhoto); // Maximum 6 photos

router.get('/:user_id', getProfilePhotos);

router.delete('/delete', deleteProfilePhoto);

router.put('/reorder', updatePhotoOrder);

module.exports = router;
