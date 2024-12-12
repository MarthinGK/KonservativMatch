const pool = require('../config/db');

// Send a Message
const sendMessage = async (req, res) => {
    const { sender_id, receiver_id, message_text } = req.body;

    try {
        // Check if sender has permission to message receiver
        const permissionResult = await pool.query(
            `SELECT * FROM messaging_permissions WHERE user_id = $1 AND can_message_id = $2`,
            [sender_id, receiver_id]
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
            [receiver_id, sender_id]
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

const fetchRecentConversations = async (req, res) => {
    const { user_id } = req.query;
  
    try {
      const result = await pool.query(
        `SELECT DISTINCT ON (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)) 
            LEAST(sender_id, receiver_id) AS user_one,
            GREATEST(sender_id, receiver_id) AS user_two,
            CASE 
                WHEN sender_id = $1 THEN receiver_id 
                ELSE sender_id 
            END AS user_id,
            message_text,
            created_at,
            CASE 
                WHEN receiver_id = $1 AND recipient_read = false THEN true
                ELSE false
            END AS unread
         FROM messages

        WHERE (sender_id = $1 AND EXISTS (
          SELECT 1 
          FROM messaging_permissions 
          WHERE user_id = $1 AND can_message_id = receiver_id
        ))
        OR (receiver_id = $1 AND EXISTS (
          SELECT 1 
          FROM messaging_permissions 
          WHERE user_id = $1 AND can_message_id = sender_id
        ))

         ORDER BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id), created_at DESC`,
        [user_id]
      );
  
      const conversations = result.rows;
  
      // Fetch additional details for each user in the conversation
      const userDetailsPromises = conversations.map(async (conversation) => {
        const userDetails = await pool.query(
          `SELECT 
             users.first_name, 
             users.last_name, 
             COALESCE(profile_photos.photo_url, '/default-profile.png') AS photo_url
           FROM users
           LEFT JOIN profile_photos 
             ON users.user_id = profile_photos.user_id AND profile_photos.position = 0
           WHERE users.user_id = $1
           LIMIT 1`,
          [conversation.user_id]
        );
  
        return {
          ...conversation,
          first_name: userDetails.rows[0]?.first_name || '',
          last_name: userDetails.rows[0]?.last_name || '',
          photo_url: userDetails.rows[0]?.photo_url,
        };
      });
  
      const enrichedConversations = await Promise.all(userDetailsPromises);
  
      res.status(200).json(enrichedConversations);
    } catch (error) {
      console.error('Error fetching recent conversations:', error);
      res.status(500).json({ error: 'Database error' });
    }
  };
  
// const fetchRecentConversations = async (req, res) => {
//   const { user_id } = req.query;

//   try {
//       const result = await pool.query(
//           `SELECT DISTINCT ON (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id)) 
//               LEAST(sender_id, receiver_id) AS user_one,
//               GREATEST(sender_id, receiver_id) AS user_two,
//               CASE 
//                   WHEN sender_id = $1 THEN receiver_id 
//                   ELSE sender_id 
//               END AS other_user_id,
//               message_text,
//               created_at,
//               CASE 
//                   WHEN receiver_id = $1 AND is_read = false THEN true
//                   ELSE false
//               END AS unread
//            FROM messages
//            WHERE (sender_id = $1 OR receiver_id = $1)
//              AND EXISTS (
//                  SELECT 1 FROM messaging_permissions 
//                  WHERE user_id = $1 AND can_message_id = CASE 
//                      WHEN sender_id = $1 THEN receiver_id ELSE sender_id END
//              )
//            ORDER BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id), created_at DESC`,
//           [user_id]
//       );

//       const conversations = result.rows;

//       // Fetch additional details for each user in the conversation
//       const userDetailsPromises = conversations.map(async (conversation) => {
//           const userDetails = await pool.query(
//               `SELECT 
//                  users.first_name, 
//                  users.last_name, 
//                  COALESCE(profile_photos.photo_url, '/default-profile.png') AS photo_url
//                FROM users
//                LEFT JOIN profile_photos 
//                  ON users.user_id = profile_photos.user_id AND profile_photos.position = 0
//                WHERE users.user_id = $1
//                LIMIT 1`,
//               [conversation.other_user_id]
//           );

//           return {
//               ...conversation,
//               first_name: userDetails.rows[0]?.first_name || '',
//               last_name: userDetails.rows[0]?.last_name || '',
//               photo_url: userDetails.rows[0]?.photo_url,
//           };
//       });

//       const enrichedConversations = await Promise.all(userDetailsPromises);

//       res.status(200).json(enrichedConversations);
//   } catch (error) {
//       console.error('Error fetching recent conversations:', error);
//       res.status(500).json({ error: 'Database error.' });
//   }
// };





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

const markMessagesAsRead = async (req, res) => {
    const { userId, profileId } = req.body; // `userId` = logged-in user, `profileId` = sender of messages

    try {
        // Update messages where the logged-in user is the recipient
        await pool.query(
            `UPDATE messages
             SET recipient_read = true
             WHERE receiver_id = $1 AND sender_id = $2`,
            [userId, profileId]
        );

        res.status(200).json({ message: 'Messages marked as read.' });
    } catch (error) {
        console.error('Error marking messages as read:', error);
        res.status(500).json({ error: 'Database error.' });
    }
};

const getUnreadMessagesCount = async (req, res) => {
  const { user_id } = req.query;

  try {
      const result = await pool.query(
          `SELECT COUNT(*) AS unread_count
           FROM messages
           WHERE receiver_id = $1 
           AND recipient_read = false
           AND EXISTS (
               SELECT 1 
               FROM messaging_permissions mp1
               WHERE mp1.user_id = messages.receiver_id
               AND mp1.can_message_id = messages.sender_id
           )
           AND EXISTS (
               SELECT 1
               FROM messaging_permissions mp2
               WHERE mp2.user_id = messages.sender_id
               AND mp2.can_message_id = messages.receiver_id
           )`,
          [user_id]
      );

      res.status(200).json({ unreadCount: result.rows[0].unread_count });
  } catch (error) {
      console.error('Error fetching unread messages count:', error);
      res.status(500).json({ error: 'Database error' });
  }
};


// const getUnreadMessagesCount = async (req, res) => {
//     const { user_id } = req.query;

//     try {
//         const result = await pool.query(
//             `SELECT COUNT(*) AS unread_count
//              FROM messages
//              WHERE receiver_id = $1 AND recipient_read = false`,
//             [user_id]
//         );

//         res.status(200).json({ unreadCount: result.rows[0].unread_count });
//     } catch (error) {
//         console.error('Error fetching unread messages count:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// };

module.exports = {
  sendMessage, 
  fetchConversation, 
  fetchRecentConversations, 
  initiateConversation, 
  markMessagesAsRead, 
  getUnreadMessagesCount
};
