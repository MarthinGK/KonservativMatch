import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/search';
const API_URL = `${API_BASE_URL}/search`;
//const API_URL  = 'http://localhost:5000/search';

export const fetchProfiles = async (ageRange, location, userId) => {
  try {
    const response = await axios.get(`${API_URL}/fetch-profiles`, {
      params: {
        minAge: ageRange.min,
        maxAge: ageRange.max,
        location,
        user_id: userId
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw error;
  }
};