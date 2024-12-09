const pool = require('../config/db');
const path = require('path');
const fs = require('fs');

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
    const { user_id, position } = req.body;

    // Check if files are uploaded
    const file = req.file; // Assuming a single file upload

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const photo_url = `/images/${file.filename}`; // Generate the photo URL

      // Insert the photo with the provided position
      await pool.query(
        'INSERT INTO profile_photos (user_id, photo_url, position) VALUES ($1, $2, $3)',
        [user_id, photo_url, position]
      );

      res.status(201).json({ message: 'Photo uploaded successfully', photo_url, position });
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
  
  const getProfilePhotos = async (req, res) => {
    const { user_id } = req.params;
  
    try {
      const result = await pool.query(
        'SELECT photo_url, position FROM profile_photos WHERE user_id = $1 ORDER BY position ASC',
        [user_id]
      );
      res.json(result.rows); // Return photo URLs with positions
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
  
      // Delete the file from the server
      const filePath = path.join(__dirname, '..', 'images', path.basename(photo_url));
      console.log("file path: ", filePath);
  
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('File deleted successfully');
        }
      });
  
      res.json({ message: 'Photo deleted successfully' });
    } catch (err) {
      console.error('Error deleting profile photo:', err);
      res.status(500).json({ error: 'Database error' });
    }
  };

  const updatePhotoOrder = async (req, res) => {
    const { user_id, photoOrder } = req.body;
  
    if (!Array.isArray(photoOrder) || photoOrder.length === 0) {
      return res.status(400).json({ error: 'Invalid photo order.' });
    }
  
    try {
      // Update positions in the database
      const query = 'UPDATE profile_photos SET position = $1 WHERE user_id = $2 AND photo_url = $3';
      for (let i = 0; i < photoOrder.length; i++) {
        await pool.query(query, [i, user_id, photoOrder[i]]);
      }
  
      res.status(200).json({ message: 'Photo order updated successfully.' });
    } catch (err) {
      console.error('Error updating photo order:', err);
      res.status(500).json({ error: 'Database error' });
    }
  };

module.exports = {
  getProfilePhotos, 
  getProfilePhotosByProfileId, 
  addProfilePhoto, 
  deleteProfilePhoto, 
  addProfilePhotos, 
  updatePhotoOrder
};