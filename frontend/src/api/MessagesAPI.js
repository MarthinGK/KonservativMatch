import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/messages';
const API_URL = `${API_BASE_URL}/messages`;
// Send a message
export const sendMessage = async (senderId, receiverId, messageText) => {
  try {
    const response = await axios.post(`${API_URL}/send`, {
      sender_id: senderId,
      receiver_id: receiverId,
      message_text: messageText,
    });
    return response.data; // Returns success message or response data
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// Fetch conversation between two users
export const fetchConversation = async (user1Id, user2Id) => {
  try {
    const response = await axios.get(`${API_URL}/conversation`, {
      params: { user1_id: user1Id, user2_id: user2Id },
    });
    return response.data; // Returns array of messages
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

// Fetch recent conversations for a user
export const fetchRecentConversations = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/recent`, {
      params: { user_id: userId },
    });
    return response.data; // Returns array of recent conversations
  } catch (error) {
    console.error('Error fetching recent conversations:', error);
    throw error;
  }
};

export const initiateConversation = async (userId, profileId) => {
    console.log("user id: ", userId)
    console.log("profile id: ", profileId)
    try {
      const response = await axios.post(`${API_URL}/initiate`, {
        userId,
        profileId,
      });
      return response.data.conversation; // Return the conversation data
    } catch (error) {
      console.error('Error initiating conversation:', error);
      throw error;
    }
  };

  export const markMessagesAsRead = async (userId, profileId) => {
    try {
      await axios.post(`${API_URL}/mark-read`, { userId, profileId });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };


  export const getUnreadMessagesCount = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/unread-messages-count`, {
            params: { user_id: userId },
        });
        return response.data.unreadCount;
    } catch (error) {
        console.error('Error fetching unread messages count:', error);
        return 0;
    }
};