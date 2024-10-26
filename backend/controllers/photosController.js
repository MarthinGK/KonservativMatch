const pool = require('../config/db');

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

  // Check if files are uploaded 
  const files = req.files || [req.file];
  if (!files || files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  try {
    const fileUrls = [];
    for (const file of files) {
      const photo_url = `/images/${file.filename}`; // Ensure path format matches your setup
      fileUrls.push(photo_url);

      // Insert photo URL into the database
      await pool.query(
        'INSERT INTO profile_photos (user_id, photo_url) VALUES ($1, $2)',
        [user_id, photo_url]
      );
    }
    res.status(201).json({ message: 'Photos uploaded successfully', photos: fileUrls });
  } catch (err) {
    console.error('Error adding profile photo:', err);
    res.status(500).json({ error: 'Database error' });
  }
};



  const addProfilePhotos = async (req, res) => {
    const { user_id } = req.body;
    const files = req.files;  // Array of uploaded files
  
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
  
    try {
      // Store all photos for the user
      const photoUrls = files.map(file => `/images/${file.filename}`);
      
      const query = 'INSERT INTO profile_photos (user_id, photo_url) VALUES ($1, $2)';
      for (const photoUrl of photoUrls) {
        await pool.query(query, [user_id, photoUrl]);
      }
  
      res.status(201).json({ message: 'Photos uploaded successfully', photoUrls });
    } catch (err) {
      console.error('Error adding profile photos:', err);
      res.status(500).json({ error: 'Database error' });
    }
  };
  
  // Fetch profile photos by user ID
  const getProfilePhotos = async (req, res) => {
    const { user_id } = req.params;
    console.log("87 userID: ", user_id)
    try {
      const result = await pool.query('SELECT photo_url FROM profile_photos WHERE user_id = $1', [user_id]);
      res.json(result.rows.map(row => row.photo_url));  // Return array of photo URLs
    } catch (err) {
      console.error('Error fetching profile photos:', err);
      res.status(500).json({ error: 'Database error' });
    }
  };
  
  // Delete a profile photo
  const deleteProfilePhoto = async (req, res) => {
    const { user_id, photo_url } = req.body;
    try {
      // Remove the photo from the DB
      await pool.query('DELETE FROM profile_photos WHERE user_id = $1 AND photo_url = $2', [user_id, photo_url]);
  
      // Optionally, delete the file from the server
      const filePath = path.join(__dirname, '..', '..', photo_url);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
  
      res.json({ message: 'Photo deleted successfully' });
    } catch (err) {
      console.error('Error deleting profile photo:', err);
      res.status(500).json({ error: 'Database error' });
    }
  };

module.exports = {
  getProfilePhotos,
  getProfilePhotosByProfileId,
  addProfilePhoto, 
  deleteProfilePhoto, 
  addProfilePhotos
};