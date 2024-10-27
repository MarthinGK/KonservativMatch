const pool = require('../config/db'); // Assuming you are using a PostgreSQL pool connection

// Function to check if user exists or create a new one if not
const checkOrCreateUser = async (req, res) => {
  const { userId, email } = req.body;
  try {
    // Check if the user exists in the database
    const userResult = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);

    if (userResult.rows.length > 0) {
      // If user exists, return their data
      const user = userResult.rows[0];
      res.status(200).json({ message: 'User exists', profileComplete: user.profile_complete });
    } else {
      // If user doesn't exist, insert a new record
      const newUser = await pool.query(
        'INSERT INTO users (user_id, email, profile_complete) VALUES ($1, $2, $3) RETURNING *',
        [userId, email, false]  // Insert with profile_complete as false initially
      );

      res.status(201).json({ message: 'User created', data: newUser.rows[0] });
    }
  } catch (error) {
    console.error('Error checking or creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Function to get the profile completion status of a user
const getProfileComplete = async (userId) => {
  try {
    const query = 'SELECT profile_complete FROM users WHERE user_id = $1';
    const values = [userId];  // Array of values for the parameterized query

    // Execute the query
    const result = await pool.query(query, values);

    // Check if user is found and return profile_complete
    if (result.rows.length > 0) {
      return result.rows[0].profile_complete;  // Return the profile_complete value
    } else {
      return null;  // Return null or handle if user is not found
    }

  } catch (err) {
    console.error('Error fetching profile_complete:', err);
    throw err;  // You can handle this differently depending on your error-handling logic
  }
};

// Function to update the user's activity timestamp
const updateUserActivity = async (req, res) => {
  const { userId } = req.body;  // Get the user ID from the request

  try {
    // Update the user's updated_at timestamp
    const result = await pool.query(
      'UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE user_id = $1',
      [userId]
    );

    res.status(200).json({ message: 'User activity updated successfully' });
  } catch (error) {
    console.error('Error updating user activity:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

// Controller function to handle saving user profile data incrementally
const saveUserProfile = async (req, res) => {
  const { userId, firstName, lastName, dateOfBirth, gender, location, religion, alcohol, smoking, height, introduction, profile_complete, created_at } = req.body;
  try {
    const checkUser = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);

    if (checkUser.rows.length > 0) {
      const result = await pool.query(
        'UPDATE users SET first_name = $1, last_name = $2, date_of_birth = $3, gender = $4, location = $5, religion = $6, alcohol = $7, smoking = $8, height = $9, introduction = $10, profile_complete = $11, created_at = $12 WHERE user_id = $13 RETURNING *',
        [firstName || checkUser.rows[0].first_name, 
         lastName || checkUser.rows[0].last_name, 
         dateOfBirth || checkUser.rows[0].date_of_birth,  // Correct column reference
         gender || checkUser.rows[0].gender,
         location || checkUser.rows[0].location,         religion || checkUser.rows[0].religion,
         alcohol || checkUser.rows[0].alcohol,
         smoking || checkUser.rows[0].smoking,
         height || checkUser.rows[0].height,
         introduction || checkUser.rows[0].introduction,
         profile_complete || checkUser.rows[0].profile_complete,
         created_at || checkUser.rows[0].created_at,
         userId]
      );
      res.status(200).json({ message: 'Profile updated', data: result.rows[0] });
    } else {
      const result = await pool.query(
        'INSERT INTO users (user_id, first_name, last_name, date_of_birth, gender, location, religion, alcohol, smoking, height, introduction, profile_complete, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
        [userId, firstName, lastName, dateOfBirth, gender, location, religion, alcohol, smoking, height, introduction, profile_complete, created_at]
      );
      res.status(201).json({ message: 'Profile created', data: result.rows[0] });
    }
  } catch (error) {
    console.error('Error saving user profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getNewMembers = async (req, res) => {
  const { user_id } = req.query; // Get the user's ID from the query parameter
  
  try {
    // First, fetch the gender of the logged-in user based on their user_id
    const userResult = await pool.query(`
      SELECT gender FROM users WHERE user_id = $1
    `, [user_id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userGender = userResult.rows[0].gender;

    // Now, fetch new members of the opposite gender
    const result = await pool.query(`
      SELECT users.profile_id, 
             users.first_name, 
             users.date_of_birth, 
             users.gender, 
             users.location,
             users.created_at,
             profile_photos.photo_url
      FROM users
      JOIN profile_photos ON users.user_id = profile_photos.user_id
      WHERE profile_photos.id IN (
        SELECT MIN(id) FROM profile_photos GROUP BY user_id
      )
      AND users.created_at IS NOT NULL  -- Only include users with a created_at date
      AND users.gender != $1  -- Only show the opposite gender
      ORDER BY users.created_at DESC 
      LIMIT 9
    `, [userGender]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching new members:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getActiveMembers = async (req, res) => {
  const { user_id } = req.query; // Get the user's ID from the query parameter

  try {

    // First, fetch the gender of the logged-in user based on their user_id
    const userResult = await pool.query(`
      SELECT gender FROM users WHERE user_id = $1
    `, [user_id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userGender = userResult.rows[0].gender;

    // Fetch members with the opposite gender, ensure created_at is not null 
    const result = await pool.query(`
      SELECT users.profile_id, 
             users.first_name, 
             users.date_of_birth, 
             users.gender, 
             users.location,
             users.created_at,
             profile_photos.photo_url
      FROM users
      JOIN profile_photos ON users.user_id = profile_photos.user_id
      WHERE profile_photos.id IN (
        SELECT MIN(id) FROM profile_photos GROUP BY user_id
      )
      AND users.created_at IS NOT NULL  -- Only include users with a created_at date
      AND users.gender != $1  -- Only show the opposite gender
      ORDER BY users.updated_at DESC  -- Order by created_at for filtering by recent members
      LIMIT 9
    `, [userGender]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching active members:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getCloseMembers = async (req, res) => {
  const { user_id } = req.query; // Get the user's ID from the query parameter

  try {
    // Fetch both gender and location of the logged-in user based on their user_id
    const userResult = await pool.query(`
      SELECT gender, location FROM users WHERE user_id = $1
    `, [user_id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userGender = userResult.rows[0].gender;
    const userLocation = userResult.rows[0].location;

    // Fetch users of the opposite gender who are in the same location
    const result = await pool.query(`
      SELECT users.first_name, 
             users.date_of_birth, 
             users.gender, 
             users.location,
             users.created_at,
             profile_photos.photo_url
      FROM users
      JOIN profile_photos ON users.user_id = profile_photos.user_id
      WHERE profile_photos.id IN (
        SELECT MIN(id) FROM profile_photos GROUP BY user_id
      )
      AND users.created_at IS NOT NULL  -- Only include users with a created_at date
      AND users.gender != $1  -- Only show the opposite gender
      AND users.location = $2  -- Only show users from the same location
      ORDER BY users.created_at DESC 
      LIMIT 9
    `, [userGender, userLocation]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching close members:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getUserProfile = async (req, res) => {
  const { profileId } = req.params;
  try {
    const userResult = await pool.query(
      `SELECT users.first_name, 
              users.last_name, 
              users.location, 
              users.height,
              users.alcohol,
              users.smoking, 
              users.religion, 
              users.date_of_birth, 
              users.introduction, 
              array_agg(profile_photos.photo_url) AS photos
      FROM users
      JOIN profile_photos ON users.user_id = profile_photos.user_id
      WHERE users.profile_id = $1
      GROUP BY users.user_id`, [profileId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userResult.rows[0]); // Return the user profile data with all photos
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Database error' });
  }
};



module.exports = {
  checkOrCreateUser, 
  getProfileComplete, 
  updateUserActivity, 
  saveUserProfile, 
  getNewMembers, 
  getActiveMembers,
  getCloseMembers, 
  getUserProfile
};