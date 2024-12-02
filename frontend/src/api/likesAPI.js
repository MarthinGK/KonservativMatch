import axios from 'axios';
const API_URL = 'http://localhost:5000/likes';

export const addLike = async (liker_id, liked_id) => {
    try {
        const response = await axios.post(API_URL, { liker_id, liked_id });
        return response.data;
    } catch (error) {
        console.error('Error adding like:', error);
        throw error;
    }
};

export const fetchLikes = async (user_id) => {
    try {
        const response = await axios.get(API_URL, { params: { user_id } });
        return response.data;
    } catch (error) {
        console.error('Error fetching likes:', error);
        throw error;
    }
};

export const fetchLikedMe = async (user_id) => {
    try {
        const response = await axios.get(`${API_URL}/liked-me`, { params: { user_id } });
        return response.data;
    } catch (error) {
        console.error('Error fetching liked-me:', error);
        throw error;
    }
};