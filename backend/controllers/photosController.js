const pool = require('../db');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); // For generating unique filenames

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION, // e.g., 'us-east-1'
});


const BUCKET_NAME = 'konservativmatch-s3-frankfurt';


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

const deleteProfilePhoto = async (req, res) => {
  const { user_id, photo_url } = req.body;

  if (!user_id || !photo_url) {
    return res.status(400).json({ error: 'user_id and photo_url are required.' });
  }

  try {
    // Remove the photo from the database
    const dbResult = await pool.query('DELETE FROM profile_photos WHERE user_id = $1 AND photo_url = $2', [user_id, photo_url]);

    if (dbResult.rowCount === 0) {
      return res.status(404).json({ error: 'Photo not found in the database.' });
    }

    // Extract the S3 key from the photo URL
    const key = photo_url.split('/').pop();

    // Delete the file from S3
    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: key,
    };

    await s3.deleteObject(deleteParams).promise();
    console.log('Photo deleted from S3:', photo_url);

    res.json({ message: 'Photo deleted successfully.' });
  } catch (err) {
    console.error('Error deleting profile photo:', err);

    // Enhanced error handling for specific S3 errors
    if (err.code === 'NoSuchKey') {
      return res.status(404).json({ error: 'Photo not found in S3.' });
    }

    res.status(500).json({ error: 'Failed to delete photo.' });
  }
};

const updatePhotoOrder = async (req, res) => {
  const { user_id, photoOrder } = req.body;

  if (!Array.isArray(photoOrder) || photoOrder.length === 0) {
    return res.status(400).json({ error: 'Invalid photo order.' });
  }

  try {
    const query = 'UPDATE profile_photos SET position = $1 WHERE user_id = $2 AND photo_url = $3';

    // Update each photo's position
    for (const { position, photo_url } of photoOrder) {
      await pool.query(query, [position, user_id, photo_url]);
    }

    res.status(200).json({ message: 'Photo order updated successfully.' });
  } catch (err) {
    console.error('Error updating photo order:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

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

    res.json(photoResult.rows.map(row => row.photo_url)); // Return array of photo URLs
  } catch (err) {
    console.error('Error fetching profile photos by profile ID:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const addProfilePhoto = async (req, res) => {
  const { user_id } = req.body;
  const position = parseInt(req.body.position, 10); // Convert position to an integer
  const file = req.file; // Single uploaded file

  console.log('Request Body:', req.body);
  console.log('Uploaded File:', req.file);
  console.log('Ppposition:', position);
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: uniqueFilename,
      Body: file.buffer, // File content
    };

    // Upload the file to S3
    const uploadResult = await s3.upload(uploadParams).promise();

    // Save the uploaded photo's URL and position to the database
    const query = 'INSERT INTO profile_photos (user_id, photo_url, position) VALUES ($1, $2, $3)';
    await pool.query(query, [user_id, uploadResult.Location, position]);

    res.status(201).json({
      message: 'Photo uploaded successfully',
      photoUrl: uploadResult.Location,
      position,
    });
  } catch (err) {
    console.error('Error uploading photo to S3:', err);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
};
















// // Fetch profile photos by profile ID
//   const getProfilePhotosByProfileId = async (req, res) => {
//     const { profileId } = req.params;

//     try {
//       // First, find the userId using the profileId
//       const userResult = await pool.query('SELECT user_id FROM users WHERE profile_id = $1', [profileId]);

//       if (userResult.rows.length === 0) {
//         return res.status(404).json({ error: 'User not found' });
//       }

//       const userId = userResult.rows[0].user_id;

//       // Fetch profile photos using userId
//       const photoResult = await pool.query('SELECT photo_url FROM profile_photos WHERE user_id = $1', [userId]);

//       res.json(photoResult.rows.map(row => row.photo_url));  // Return array of photo URLs
//     } catch (err) {
//       console.error('Error fetching profile photos by profile ID:', err);
//       res.status(500).json({ error: 'Database error' });
//     }
//   };

//   const addProfilePhoto = async (req, res) => {
//     const { user_id, position } = req.body;

//     // Check if files are uploaded
//     const file = req.file; // Assuming a single file upload

//     if (!file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     try {
//       const photo_url = `/images/${file.filename}`; // Generate the photo URL

//       // Insert the photo with the provided position
//       await pool.query(
//         'INSERT INTO profile_photos (user_id, photo_url, position) VALUES ($1, $2, $3)',
//         [user_id, photo_url, position]
//       );

//       res.status(201).json({ message: 'Photo uploaded successfully', photo_url, position });
//     } catch (err) {
//       console.error('Error adding profile photo:', err);
//       res.status(500).json({ error: 'Database error' });
//     }
//   };

  // const addProfilePhotos = async (req, res) => {
  //   const { user_id } = req.body;
  //   const files = req.files;  // Array of uploaded files
  
  //   if (!files || files.length === 0) {
  //     return res.status(400).json({ error: 'No files uploaded' });
  //   }
  
  //   try {
  //     // Store all photos for the user
  //     const photoUrls = files.map(file => `/images/${file.filename}`);
      
  //     const query = 'INSERT INTO profile_photos (user_id, photo_url) VALUES ($1, $2)';
  //     for (const photoUrl of photoUrls) {
  //       await pool.query(query, [user_id, photoUrl]);
  //     }
  
  //     res.status(201).json({ message: 'Photos uploaded successfully', photoUrls });
  //   } catch (err) {
  //     console.error('Error adding profile photos:', err);
  //     res.status(500).json({ error: 'Database error' });
  //   }
  // };
  
  // const getProfilePhotos = async (req, res) => {
  //   const { user_id } = req.params;
  
  //   try {
  //     const result = await pool.query(
  //       'SELECT photo_url, position FROM profile_photos WHERE user_id = $1 ORDER BY position ASC',
  //       [user_id]
  //     );
  //     res.json(result.rows); // Return photo URLs with positions
  //   } catch (err) {
  //     console.error('Error fetching profile photos:', err);
  //     res.status(500).json({ error: 'Database error' });
  //   }
  // };
  
  
  // // Delete a profile photo
  // const deleteProfilePhoto = async (req, res) => {
  //   const { user_id, photo_url } = req.body;
  
  //   try {
  //     // Remove the photo from the DB
  //     await pool.query('DELETE FROM profile_photos WHERE user_id = $1 AND photo_url = $2', [user_id, photo_url]);
  
  //     // Delete the file from the server
  //     const filePath = path.join(__dirname, '..', 'images', path.basename(photo_url));
  //     console.log("file path: ", filePath);
  
  //     fs.unlink(filePath, (err) => {
  //       if (err) {
  //         console.error('Error deleting file:', err);
  //       } else {
  //         console.log('File deleted successfully');
  //       }
  //     });
  
  //     res.json({ message: 'Photo deleted successfully' });
  //   } catch (err) {
  //     console.error('Error deleting profile photo:', err);
  //     res.status(500).json({ error: 'Database error' });
  //   }
  // };

  // const updatePhotoOrder = async (req, res) => {
  //   const { user_id, photoOrder } = req.body;
  
  //   if (!Array.isArray(photoOrder) || photoOrder.length === 0) {
  //     return res.status(400).json({ error: 'Invalid photo order.' });
  //   }
  
  //   try {
  //     // Update positions in the database
  //     const query = 'UPDATE profile_photos SET position = $1 WHERE user_id = $2 AND photo_url = $3';
  //     for (let i = 0; i < photoOrder.length; i++) {
  //       await pool.query(query, [i, user_id, photoOrder[i]]);
  //     }
  
  //     res.status(200).json({ message: 'Photo order updated successfully.' });
  //   } catch (err) {
  //     console.error('Error updating photo order:', err);
  //     res.status(500).json({ error: 'Database error' });
  //   }
  // };

module.exports = {
  getProfilePhotos, 
  getProfilePhotosByProfileId, 
  addProfilePhoto, 
  deleteProfilePhoto,
  updatePhotoOrder
};