const pool = require('../config/db');

// Fetch profile photos by user ID
const getProfilePhotos = async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT photo_url FROM profile_photos WHERE user_id = $1', [user_id]);
    res.json(result.rows.map(row => row.photo_url));  // Return array of photo URLs
  } catch (err) {
    console.error('Error fetching profile photos:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Fetch profile photos by profile ID
const getProfilePhotosByProfileId = async (req, res) => {
  const { profileId } = req.params;

  try {
    // First, find the userId using the profileId
    const userResult = await pool.query('SELECT user_id FROM users WHERE profile_id = $1', [profileId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].user_id;

    // Fetch profile photos using userId
    const photoResult = await pool.query('SELECT photo_url FROM profile_photos WHERE user_id = $1', [userId]);

    res.json(photoResult.rows.map(row => row.photo_url));  // Return array of photo URLs
  } catch (err) {
    console.error('Error fetching profile photos by profile ID:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const addProfilePhoto = async (req, res) => {
    const { user_id } = req.body;
  
    // If single file is uploaded, req.file will be used. If multiple, req.files will be used
    const files = req.files || [req.file]; // Multer handles both cases
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
  
    try {
      const fileUrls = [];
  
      for (const file of files) {
        const photo_url = `/images/${file.filename}`; // Path to where the file is saved
        fileUrls.push(photo_url);
  
        // Insert each photo into the database
        await pool.query(
          'INSERT INTO profile_photos (user_id, photo_url) VALUES ($1, $2) RETURNING *',
          [user_id, photo_url]
        );
      }
  
      res.status(201).json({ message: 'Photos uploaded successfully', photos: fileUrls });
    } catch (err) {
      console.error('Error adding profile photo:', err);
      res.status(500).json({ error: 'Database error' });
    }
  };

module.exports = {
  getProfilePhotos,
  getProfilePhotosByProfileId,
  addProfilePhoto
};