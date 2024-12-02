const pool = require('../config/db');

// Add a like
const addLike = async (req, res) => {
    const { liker_id, liked_id } = req.body;

    try {
        await pool.query(
            'INSERT INTO likes (liker_id, liked_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [liker_id, liked_id]
        );
        res.status(201).json({ message: 'Like added successfully' });
    } catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get all likes by a user
const getLikes = async (req, res) => {
    const { user_id } = req.query;

    try {
        const result = await pool.query(
            'SELECT liked_id FROM likes WHERE liker_id = $1',
            [user_id]
        );
        res.json(result.rows.map(row => row.liked_id));
    } catch (error) {
        console.error('Error fetching likes:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get all users who liked the logged-in user
const getLikedMe = async (req, res) => {
    const { user_id } = req.query;

    try {
        const result = await pool.query(
            'SELECT liker_id FROM likes WHERE liked_id = $1',
            [user_id]
        );
        res.json(result.rows.map(row => row.liker_id));
    } catch (error) {
        console.error('Error fetching liked-me:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = { addLike, getLikes, getLikedMe };
