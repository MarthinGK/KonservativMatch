const pool = require('../config/db'); // Assuming you are using a PostgreSQL pool connection

// Function to check if user exists or create a new one if not
const checkOrCreateUser = async (req, res) => {
  const { userId, email } = req.body;

  console.log('userController checkOrCreateUser - userId = ', userId);
  console.log('userController checkOrCreateUser - email = ', email);

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
const getProfileComplete = async (req, res) => {
  const { userId } = req.query; // userId from query params

  try {
    const result = await pool.query('SELECT profile_complete FROM users WHERE user_id = $1', [userId]);

    if (result.rows.length > 0) {
      res.status(200).json({ profile_complete: result.rows[0].profile_complete });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching profile_complete:', error);
    res.status(500).json({ error: 'Database error' });
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

module.exports = {
  checkOrCreateUser,
  getProfileComplete,
  updateUserActivity,
};