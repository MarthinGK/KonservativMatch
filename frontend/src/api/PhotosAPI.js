import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL; // Assuming you have a configured environment variable

export const uploadProfilePhoto = async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append('user_id', userId);  // Add user ID to the form
      formData.append('photo', file);  // Add single file ('photo' is the key used on the backend)
  
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      return response.data; 
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      throw error;
    }
  };
  
  // Fetch user’s profile photos
  export const fetchProfilePhotos = async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`);
      return response.data; // Return the array of photos
    } catch (error) {
      console.error('Error fetching profile photos:', error);
      throw error;
    }
  };
  
  // Delete profile photo
  export const deleteProfilePhoto = async (userId, photoUrl) => {
    try {
      const response = await axios.delete(`${API_URL}/delete`, {
        data: { user_id: userId, photo_url: photoUrl },
      });
      return response.data; // Return the result of the deletion
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      throw error;
    }
  };