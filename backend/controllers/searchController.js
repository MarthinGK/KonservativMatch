const searchProfiles = async (req, res) => {
    const { minAge, maxAge, location, user_id, page = 1 } = req.query;
  
    const profilesPerPage = 1; // Profiles per page
    const offset = (page - 1) * profilesPerPage;
  
    try {
      // Get user's gender
      const userResult = await pool.query(
        `SELECT gender FROM users WHERE user_id = $1`,
        [user_id]
      );
  
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userGender = userResult.rows[0].gender;
  
      // Construct the SQL query
      let query = `
        SELECT 
          users.first_name, 
          users.profile_id, 
          users.date_of_birth, 
          users.location, 
          EXTRACT(YEAR FROM AGE(users.date_of_birth)) AS age,
          (
            SELECT photo_url 
            FROM profile_photos 
            WHERE user_id = users.user_id AND position = 0 
            LIMIT 1
          ) AS profile_photo
        FROM users
        WHERE EXTRACT(YEAR FROM AGE(users.date_of_birth)) BETWEEN $1 AND $2
          AND users.gender != $3
          AND users.created_at IS NOT NULL
      `;
  
      const values = [minAge, maxAge, userGender];
  
      // Add location filter if provided
      if (location) {
        query += ' AND users.location = $4';
        values.push(location);
      }
  
      query += `
        ORDER BY users.created_at DESC
        LIMIT $${values.length + 1} OFFSET $${values.length + 2}
      `;
  
      values.push(profilesPerPage, offset);
  
      const result = await pool.query(query, values);
  
      // Get total count for pagination
      const countQuery = `
        SELECT COUNT(*) AS total 
        FROM users
        WHERE EXTRACT(YEAR FROM AGE(users.date_of_birth)) BETWEEN $1 AND $2
          AND users.gender != $3
          AND users.created_at IS NOT NULL
      `;
      const countValues = [minAge, maxAge, userGender];
  
      if (location) {
        countQuery += ' AND users.location = $4';
        countValues.push(location);
      }
  
      const countResult = await pool.query(countQuery, countValues);
      const totalProfiles = parseInt(countResult.rows[0].total);
      const totalPages = Math.ceil(totalProfiles / profilesPerPage);
  
      res.json({ data: result.rows, totalPages });
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ error: "Database error" });
    }
  };
  
  module.exports = {
    searchProfiles
  };

  
// const pool = require('../db'); // Assuming pool is set up for database connection

// const searchProfiles = async (req, res) => {
//   const { minAge, maxAge, location, user_id } = req.query;

//   try {
//       // First, fetch the gender of the logged-in user based on their user_id
//       const userResult = await pool.query(
//           `SELECT gender FROM users WHERE user_id = $1`,
//           [user_id]
//       );

//       if (userResult.rows.length === 0) {
//           return res.status(404).json({ error: 'User not found' });
//       }

//       const userGender = userResult.rows[0].gender;

//       // Construct the SQL query for search
//       let query = `
//           SELECT 
//               users.first_name, 
//               users.profile_id, 
//               users.date_of_birth, 
//               users.location, 
//               EXTRACT(YEAR FROM AGE(users.date_of_birth)) AS age,
//               (
//                   SELECT photo_url 
//                   FROM profile_photos 
//                   WHERE user_id = users.user_id AND position = 0 
//                   LIMIT 1
//               ) AS profile_photo
//           FROM users
//           WHERE EXTRACT(YEAR FROM AGE(users.date_of_birth)) BETWEEN $1 AND $2
//             AND users.gender != $3
//             AND users.created_at IS NOT NULL -- Only include users with a created_at date
//       `;

//       const values = [minAge, maxAge, userGender];

//       // Add location filter if provided
//       if (location) {
//           query += ' AND users.location = $4';
//           values.push(location);
//       }

//       // Execute the query with the parameters
//       const result = await pool.query(query, values);

//       res.json(result.rows);
//   } catch (error) {
//       console.error("Error fetching profiles:", error);
//       res.status(500).json({ error: "Database error" });
//   }
// };

  

// module.exports = {
//   searchProfiles
// };
