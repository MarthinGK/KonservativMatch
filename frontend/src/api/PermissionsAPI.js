import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${API_BASE_URL}/permissions`;
//const API_URL = 'http://localhost:5000/permissions';

// Grant messaging permission
export const grantPermission = async (userId, canMessageId) => {
  try {
    const response = await axios.post(`${API_URL}/grant`, {
      user_id: userId,
      can_message_id: canMessageId,
    });
    return response.data; // Returns success message
  } catch (error) {
    console.error('Error granting permission:', error);
    throw error;
  }
};

// Check if a user has messaging permission
export const checkPermission = async (userId, canMessageId) => {
  try {
    const response = await axios.get(`${API_URL}/check`, {
      params: { user_id: userId, can_message_id: canMessageId },
    });
    return response.data.permitted; // Returns true or false
  } catch (error) {
    console.error('Error checking permission:', error);
    throw error;
  }
};

// Revoke messaging permission
export const revokePermission = async (userId, canMessageId) => {
  try {
    const response = await axios.post(`${API_URL}/revoke`, {
      user_id: userId,
      can_message_id: canMessageId,
    });
    return response.data; // Returns success message
  } catch (error) {
    console.error('Error revoking permission:', error);
    throw error;
  }
};
