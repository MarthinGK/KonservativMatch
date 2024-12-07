const pool = require('../config/db');

// Get all likes by a user
const getLikes = async (req, res) => {
    const { userId } = req.query;
  
    try {
      const query = `
        SELECT 
          users.first_name,
          users.profile_id,
          users.date_of_birth,
          users.location,
          profile_photos.photo_url
        FROM likes
        JOIN users ON likes.liked_id = users.user_id
        LEFT JOIN profile_photos ON users.user_id = profile_photos.user_id
        WHERE likes.liker_id = $1
        AND profile_photos.id = (
          SELECT MIN(id) 
          FROM profile_photos 
          WHERE profile_photos.user_id = users.user_id
        )
      `;
  
      const result = await pool.query(query, [userId]);
  
      res.status(200).json(result.rows); // Return array of profiles the user has liked
    } catch (error) {
      console.error('Error fetching liked profiles:', error);
      res.status(500).json({ error: 'Database error' });
    }
  };

// Get all users who liked the logged-in user
const getLikedMe = async (req, res) => {
    const { user_id } = req.query;
  
    try {
      const query = `
        SELECT 
          users.user_id,
          users.first_name,
          users.profile_id,
          users.date_of_birth,
          users.location,
          profile_photos.photo_url
        FROM likes
        JOIN users ON likes.liker_id = users.user_id
        LEFT JOIN profile_photos ON users.user_id = profile_photos.user_id
        WHERE likes.liked_id = $1
        AND profile_photos.id = (
          SELECT MIN(id) 
          FROM profile_photos 
          WHERE profile_photos.user_id = users.user_id
        )
      `;
  
      const result = await pool.query(query, [user_id]);
  
      res.status(200).json(result.rows); // Return array of users who liked the current user
    } catch (error) {
      console.error('Error fetching liked-me:', error);
      res.status(500).json({ error: 'Database error' });
    }
};

const checkLikeStatus = async (req, res) => {
    const { likerId, likedId } = req.query;
  
    try {
      const result = await pool.query(
        'SELECT COUNT(*) FROM likes WHERE liker_id = $1 AND liked_id = $2',
        [likerId, likedId]
      );
  
      const isLiked = parseInt(result.rows[0].count, 10) > 0;
      res.status(200).json({ isLiked });
    } catch (error) {
      console.error('Error checking like status:', error);
      res.status(500).json({ error: 'Database error' });
    }
  };

  const toggleLike = async (req, res) => {
    const { likerId, likedId } = req.body;
  
    try {
      // Check if the like already exists
      const result = await pool.query(
        'SELECT COUNT(*) FROM likes WHERE liker_id = $1 AND liked_id = $2',
        [likerId, likedId]
      );
  
      const isLiked = parseInt(result.rows[0].count, 10) > 0;
  
      if (isLiked) {
        // Remove the like
        await pool.query(
          'DELETE FROM likes WHERE liker_id = $1 AND liked_id = $2',
          [likerId, likedId]
        );
  
        // Remove messaging permission
        await pool.query(
          'DELETE FROM messaging_permissions WHERE user_id = $1 AND can_message_id = $2',
          [likedId, likerId]
        );
  
        res.status(200).json({ message: 'Like removed, messaging permission removed', isLiked: false });
      } else {
        // Add the like
        await pool.query(
          'INSERT INTO likes (liker_id, liked_id) VALUES ($1, $2)',
          [likerId, likedId]
        );
  
        // Add messaging permission
        await pool.query(
          `INSERT INTO messaging_permissions (user_id, can_message_id) VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [likedId, likerId]
        );
  
        res.status(200).json({ message: 'Like added, messaging permission granted', isLiked: true });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      res.status(500).json({ error: 'Database error' });
    }
  };
  
  
  

module.exports = { getLikes, getLikedMe, checkLikeStatus, toggleLike };
