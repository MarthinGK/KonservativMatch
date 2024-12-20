import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/photos';
const API_URL = `${API_BASE_URL}/photos`;
// const API_URL = 'http://localhost:5000/photos';

  // Fetch user’s profile photos 
  export const fetchProfilePhotos = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`);
      return response.data;  // Return the array of photos
    } catch (error) {
      console.error('Error fetching profile photos:', error);
      throw error;
    }
  };

  export const uploadProfilePhoto = async (userId, file, position) => {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('file', file);
    formData.append('position', position); // Include position
  
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error;
    }
  };  

  export const deleteProfilePhoto = async (userId, photoUrl) => {
    try {
      const response = await axios.delete(`${API_URL}/delete`, {
        data: { user_id: userId, photo_url: photoUrl },
      });
      return response.data;  // Return the result of the deletion
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      throw error;
    }
  };

  export const updatePhotoOrder = async (userId, photoOrder) => {
    try {
      const response = await axios.put(`${API_URL}/reorder`, {
        user_id: userId,
        photoOrder, // Array of photo URLs in the new order
      });
      return response.data;
    } catch (error) {
      console.error('Error updating photo order:', error);
      throw error;
    }
  };