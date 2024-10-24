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

module.exports = {
  checkOrCreateUser,
  getProfileComplete,
  updateUserActivity,
};