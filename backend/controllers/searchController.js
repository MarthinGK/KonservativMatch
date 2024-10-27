// backend/controllers/searchController.js
const pool = require('../config/db'); // Assuming pool is set up for database connection

const searchProfiles = async (req, res) => {
    const { minAge, maxAge, location, user_id } = req.query;
  
    try {
      // First, fetch the gender of the logged-in user based on their user_id
      const userResult = await pool.query(
        `SELECT gender FROM users WHERE user_id = $1`,
        [user_id]
      );
  
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userGender = userResult.rows[0].gender;
  
      // Construct the SQL query for search
      let query = `
        SELECT users.first_name, 
               users.date_of_birth, 
               users.location, 
               profile_photos.photo_url,
               EXTRACT(YEAR FROM AGE(users.date_of_birth)) AS age
        FROM users
        JOIN profile_photos ON users.user_id = profile_photos.user_id
        WHERE profile_photos.id IN (
          SELECT MIN(id) FROM profile_photos GROUP BY user_id
        )
        AND EXTRACT(YEAR FROM AGE(users.date_of_birth)) BETWEEN $1 AND $2
        AND users.created_at IS NOT NULL  -- Only include users with a created_at date
        AND users.gender != $3
      `;
  
      const values = [minAge, maxAge, userGender];
  
      // Add location filter if provided
      if (location) {
        query += ' AND users.location = $4';
        values.push(location);
      }
  
      // Execute the query with the parameters
      const result = await pool.query(query, values);
  
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ error: "Database error" });
    }
  };
  

module.exports = {
  searchProfiles
};
