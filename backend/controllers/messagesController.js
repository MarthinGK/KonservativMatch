const pool = require('../config/db');

// Send a Message
const sendMessage = async (req, res) => {
    const { sender_id, receiver_id, message_text } = req.body;

    try {
        // Check if sender has permission to message receiver
        const permissionResult = await pool.query(
            `SELECT * FROM messaging_permissions WHERE user_id = $1 AND can_message_id = $2`,
            [receiver_id, sender_id]
        );

        if (permissionResult.rows.length === 0) {
            return res.status(403).json({ error: 'Messaging not permitted' });
        }

        // Add the message to the database
        await pool.query(
            `INSERT INTO messages (sender_id, receiver_id, message_text) VALUES ($1, $2, $3)`,
            [sender_id, receiver_id, message_text]
        );

        // Grant reverse messaging permission
        await pool.query(
            `INSERT INTO messaging_permissions (user_id, can_message_id) VALUES ($1, $2)
             ON CONFLICT DO NOTHING`,
            [sender_id, receiver_id]
        );

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Fetch Conversation
const fetchConversation = async (req, res) => {
    const { user1_id, user2_id } = req.query;

    try {
        const result = await pool.query(
            `SELECT * FROM messages
             WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
             ORDER BY created_at ASC`,
            [user1_id, user2_id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

// Fetch Recent Conversations
const fetchRecentConversations = async (req, res) => {
    const { user_id } = req.query;

    try {
        const result = await pool.query(
            `SELECT DISTINCT ON (sender_id, receiver_id) sender_id, receiver_id, message_text, created_at
             FROM messages
             WHERE sender_id = $1 OR receiver_id = $1
             ORDER BY sender_id, receiver_id, created_at DESC`,
            [user_id]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching recent conversations:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

const initiateConversation = async (req, res) => {
    const { userId, profileId } = req.body; // `userId` is the current user, `profileId` is the clicked profile.
  
    try {
      // Check if permission exists in messaging_permissions
      const permissionCheck = await pool.query(
        'SELECT * FROM messaging_permissions WHERE (user_id = $1 AND can_message_id = $2) OR (user_id = $2 AND can_message_id = $1)',
        [userId, profileId]
      );
  
      if (permissionCheck.rows.length === 0) {
        // If no permission, add one
        await pool.query(
          'INSERT INTO messaging_permissions (sender_id, receiver_id) VALUES ($1, $2)',
          [userId, profileId]
        );
      }
  
      // Fetch conversation (or create if it doesn't exist)
      const messages = await pool.query(
        `SELECT * FROM messages 
         WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
         ORDER BY created_at ASC`,
        [userId, profileId]
      );
  
      res.status(200).json({ conversation: messages.rows });
    } catch (error) {
      console.error('Error initiating conversation:', error);
      res.status(500).json({ error: 'Failed to initiate conversation' });
    }
  };  

module.exports = {
    sendMessage,
    fetchConversation,
    fetchRecentConversations, 
    initiateConversation
};
