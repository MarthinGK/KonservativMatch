import axios from 'axios';

const API_URL = 'http://localhost:5000/auth0';

export const updateUserEmail = async (userId, email) => {
  try {
    const response = await axios.put(`${API_URL}/update_email`, { userId, email });
    return response.data; // Return success message or any response data
  } catch (error) {
    console.error('Error updating email:', error);
    throw error;
  }
};