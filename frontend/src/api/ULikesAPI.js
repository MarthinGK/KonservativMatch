import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_URL = `${API_BASE_URL}/likes`;
//const API_URL = 'http://localhost:5000/likes';

export const fetchLikes = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/liked-by`, { params: { userId } });
    console.log("RESPONSE: ", response)
    return response.data; // Return the array of users
  } catch (error) {
    console.error('Error fetching likes:', error);
    throw error;
  }
};

export const fetchLikedMe = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/liked-me`, { params: { user_id: userId } });
      return response.data; // Return array of users
    } catch (error) {
      console.error('Error fetching liked-me:', error);
      throw error;
    }
};

export const fetchLikeStatus = async (likerId, likedId) => {
    try {
      const response = await axios.get(`${API_URL}/status`, {
        params: { likerId, likedId },
      });
      return response.data.isLiked; // Return true/false
    } catch (error) {
      console.error('Error fetching like status:', error);
      throw error;
    }
  };
  
  // Toggle like status
  export const toggleLike = async (likerId, likedId) => {
    try {
      const response = await axios.post(`${API_URL}/toggle`, { likerId, likedId });
      return response.data.isLiked; // Return true/false
    } catch (error) {
      console.error('Error toggling like status:', error);
      throw error;
    }
  };
  
  export const fetchMatches = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/matches`, { params: { userId } });
      return response.data; // Return array of matched users
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  };