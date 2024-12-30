const pool = require('../db'); // Assuming you are using a PostgreSQL pool connection

// Function to check if user exists or create a new one if not
const checkOrCreateUser = async (req, res) => {
  const { userId, email } = req.body;
  try {
    // Use UPSERT to check or create user in one query
    const query = `
      INSERT INTO users (user_id, email, profile_complete)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id) DO NOTHING
      RETURNING profile_complete;
    `;
    const result = await pool.query(query, [userId, email, false]);

    // If no rows were returned, the user already exists
    if (result.rows.length === 0) {
      const existingUser = await pool.query('SELECT profile_complete FROM users WHERE user_id = $1', [userId]);
      res.status(200).json({ message: 'User exists', profileComplete: existingUser.rows[0].profile_complete });
    } else {
      res.status(201).json({ message: 'User created', data: result.rows[0] });
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
  const { userId, firstName, lastName, dateOfBirth, gender, location, religion, alcohol, smoking, height, introduction, profile_complete, created_at, political_party, want_children } = req.body;
  try {
    const checkUser = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);

    if (checkUser.rows.length > 0) {
      const result = await pool.query(
        'UPDATE users SET first_name = $1, last_name = $2, date_of_birth = $3, gender = $4, location = $5, religion = $6, alcohol = $7, smoking = $8, height = $9, introduction = $10, profile_complete = $11, created_at = $12, political_party = $13, want_children = $14 WHERE user_id = $15 RETURNING *',
        [firstName || checkUser.rows[0].first_name, 
         lastName || checkUser.rows[0].last_name, 
         dateOfBirth || checkUser.rows[0].date_of_birth,
         gender || checkUser.rows[0].gender,
         location || checkUser.rows[0].location,
         religion || checkUser.rows[0].religion,
         alcohol || checkUser.rows[0].alcohol,
         smoking || checkUser.rows[0].smoking,
         height || checkUser.rows[0].height,
         introduction || checkUser.rows[0].introduction,
         profile_complete || checkUser.rows[0].profile_complete,
         created_at || checkUser.rows[0].created_at,
         political_party || checkUser.rows[0].political_party, 
         want_children || checkUser.rows[0].want_children,
         userId]
      );
      res.status(200).json({ message: 'Profile updated', data: result.rows[0] });
    } else {
      const result = await pool.query(
        'INSERT INTO users (user_id, first_name, last_name, date_of_birth, gender, location, religion, alcohol, smoking, height, introduction, profile_complete, created_at, political_party, want_children) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *',
        [userId, firstName, lastName, dateOfBirth, gender, location, religion, alcohol, smoking, height, introduction, profile_complete, created_at, political_party, want_children]
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

    // Now, fetch new members of the opposite gender with their main profile photo
    const result = await pool.query(`
      SELECT users.profile_id, 
             users.first_name, 
             users.date_of_birth, 
             users.gender, 
             users.location,
             users.created_at,
             profile_photos.photo_url
      FROM users
      LEFT JOIN profile_photos ON users.user_id = profile_photos.user_id
      WHERE profile_photos.position = 0 -- Only select the main photo
      AND users.created_at IS NOT NULL  -- Only include users with a created_at date
      AND users.gender != $1  -- Only show the opposite gender
      AND users.profile_active = TRUE -- Exclude inactive profiles
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
    // Fetch the gender of the logged-in user
    const userResult = await pool.query(`
      SELECT gender FROM users WHERE user_id = $1
    `, [user_id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userGender = userResult.rows[0].gender;

    // Fetch members of the opposite gender with their main profile photo
    const result = await pool.query(`
      SELECT users.profile_id, 
             users.first_name, 
             users.date_of_birth, 
             users.gender, 
             users.location,
             users.updated_at,
             profile_photos.photo_url
      FROM users
      LEFT JOIN profile_photos ON users.user_id = profile_photos.user_id
      WHERE profile_photos.position = 0 -- Select the main photo
      AND users.created_at IS NOT NULL  -- Only include users with a created_at date
      AND users.gender != $1  -- Only show the opposite gender
      AND users.profile_active = TRUE -- Exclude inactive profiles
      ORDER BY users.updated_at DESC  -- Order by updated_at for recent activity
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
    // Fetch both gender and location of the logged-in user
    const userResult = await pool.query(`
      SELECT gender, location FROM users WHERE user_id = $1
    `, [user_id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userGender = userResult.rows[0].gender;
    const userLocation = userResult.rows[0].location;

    // Fetch users of the opposite gender who are in the same location with their main profile photo
    const result = await pool.query(`
      SELECT users.profile_id, 
             users.first_name, 
             users.date_of_birth, 
             users.gender, 
             users.location,
             users.created_at,
             profile_photos.photo_url
      FROM users
      LEFT JOIN profile_photos ON users.user_id = profile_photos.user_id
      WHERE profile_photos.position = 0 -- Select the main photo
      AND users.created_at IS NOT NULL  -- Only include users with a created_at date
      AND users.gender != $1  -- Only show the opposite gender
      AND users.location = $2  -- Only show users from the same location
      AND users.profile_active = TRUE -- Exclude inactive profiles
      ORDER BY users.created_at DESC 
      LIMIT 9
    `, [userGender, userLocation]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching close members:', err);
    res.status(500).json({ error: 'Database error' });
  }
};


const getPreviewProfile = async (req, res) => {
  const { user_id } = req.query;
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
              users.political_party, 
              users.want_children, 
              json_agg(json_build_object('photo_url', profile_photos.photo_url, 'position', profile_photos.position)) AS photos
       FROM users
       JOIN profile_photos ON users.user_id = profile_photos.user_id
       WHERE users.user_id = $1
       GROUP BY users.user_id`, [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userResult.rows[0]); // Return the user profile data with all photos and positions
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: 'Database error' });
  }
};


const getUserProfile = async (req, res) => {
  const { brukerId } = req.params;
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
              users.political_party, 
              users.want_children, 
              json_agg(json_build_object('photo_url', profile_photos.photo_url, 'position', profile_photos.position)) AS photos
      FROM users
      JOIN profile_photos ON users.user_id = profile_photos.user_id
      WHERE users.profile_id = $1
      GROUP BY users.user_id`, [brukerId]
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

const getUserIntroduction = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query('SELECT introduction FROM users WHERE user_id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ introduction: result.rows[0].introduction });
  } catch (err) {
    console.error('Error fetching user introduction:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Save user's introduction
const saveUserIntroduction = async (req, res) => {
  const { userId, introduction } = req.body;

  try {
    await pool.query('UPDATE users SET introduction = $1 WHERE user_id = $2', [introduction, userId]);
    res.json({ message: 'Introduction updated successfully' });
  } catch (err) {
    console.error('Error saving user introduction:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getUserProfileByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const userResult = await pool.query(
      `SELECT 
          first_name, 
          last_name, 
          location, 
          height, 
          alcohol, 
          smoking, 
          religion, 
          email, 
          TO_CHAR(date_of_birth, 'YYYY-MM-DD') AS date_of_birth, 
          introduction, 
          political_party, 
          want_children, 
          (SELECT photo_url 
           FROM profile_photos 
           WHERE user_id = $1 AND position = 0 
           LIMIT 1) AS profile_photo 
       FROM users
       WHERE user_id = $1`,
      [user_id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(userResult.rows[0]);
  } catch (err) {
    console.error('Error fetching user profile by user_id:', err);
    res.status(500).json({ error: 'Database error' });
  }
};


// Update user profile details by user_id
const saveUserProfileByUserId = async (req, res) => {
  const { user_id } = req.params;
  const { first_name, last_name, location, height, alcohol, smoking, religion, date_of_birth, introduction, political_party, want_children } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           location = COALESCE($3, location),
           height = COALESCE($4, height),
           alcohol = COALESCE($5, alcohol),
           smoking = COALESCE($6, smoking),
           religion = COALESCE($7, religion),
           date_of_birth = COALESCE($8, date_of_birth),
           introduction = COALESCE($9, introduction),
           political_party = COALESCE($10, political_party),
           want_children = COALESCE($11, want_children)
       WHERE user_id = $12
       RETURNING *`,
      [first_name, last_name, location, height, alcohol, smoking, religion, date_of_birth, introduction, political_party, want_children, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found or no changes made' });
    }

    res.json({ message: 'Profile updated successfully', data: result.rows[0] });
  } catch (err) {
    console.error('Error updating user profile by user_id:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const updateProfileActiveStatus = async (req, res) => {
  const { user_id } = req.params;
  const { profile_active } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET profile_active = $1
       WHERE user_id = $2
       RETURNING profile_active`,
      [profile_active, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found or no changes made' });
    }

    res.status(200).json({
      message: 'Profile active status updated successfully',
      profile_active: result.rows[0].profile_active,
    });
  } catch (err) {
    console.error('Error updating profile active status:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

const getProfileActiveStatus = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT profile_active FROM users WHERE user_id = $1',
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ profile_active: result.rows[0].profile_active });
  } catch (error) {
    console.error('Error fetching profile active status:', error);
    res.status(500).json({ error: 'Database error' });
  }
};

const getUserIdById = async (req, res) => {
  const { id } = req.params; // Get id from request parameters

  try {
    const result = await pool.query('SELECT user_id FROM users WHERE profile_id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user_id: result.rows[0].user_id });
  } catch (error) {
    console.error('Error retrieving user_id:', error);
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
  getUserProfile, 
  getPreviewProfile, 
  getUserIntroduction, 
  saveUserIntroduction, 
  getUserProfileByUserId, 
  saveUserProfileByUserId, 
  updateProfileActiveStatus, 
  getProfileActiveStatus, 
  getUserIdById
};