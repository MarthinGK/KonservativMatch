import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
//const API_URL = `${API_BASE_URL}/users`;
const API_URL = 'http://localhost:5000/users';

// Check if user exists in the database, and create if not
export const checkUserInDB = async (user) => {
  try {
    // Send the user_id and email to the backend
    await axios.post(`${API_URL}/check`, {
      userId: user.sub,  // user.sub is the Auth0 user ID
      email: user.email,
    });
  } catch (error) {
    console.error('Error checking/creating user:', error);
    throw error;
  }
};

// Check if user's profile is complete
export const checkIfProfileIsComplete = async (user) => {
  console.log("UserAPI.js checkIfProfileIsComplete param: ", user);
  try {
    // Use params to send user.sub as a query parameter
    const response = await axios.get(`${API_URL}/profile_complete`, {
      params: { userId: user.sub }
    });

    console.log("UserAPI.js checkIfProfileIsComplete response.data.profile_complete: ", response.data.profile_complete);
    return response.data.profile_complete;
  } catch (error) {
    console.error('Error UserAPI.js checkIfProfileIsComplete: ', error);
    throw error;
  }
};

// Fetch user profile based on profile ID
export const fetchUserProfile = async (brukerId) => {
  try {
    const response = await axios.get(`${API_URL}/bruker/${brukerId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Fetch user profile based on profile ID
export const getPreviewProfile = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/preview-profile`, {
      params: {
        user_id: userId, // Pass the user's ID as a query parameter
      },
    });
    return response.data; // The returned data now includes `position` for each photo
  } catch (error) {
    console.error('Error fetching previewProfile:', error);
    throw error;
  }
};

// Update user activity timestamp
export const updateUserActivity = async (userId) => {
  try {
    await axios.post(`${API_URL}/update_activity`, { userId });
  } catch (error) {
    console.error('Error updating user activity:', error);
    throw error;
  }
};

export const saveUserProfile = async (profileData) => {
  console.log("profile data: ", profileData);
  try {
    const response = await axios.post(`${API_URL}/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

// Fetch new members based on user preferences
export const fetchNewMembers = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/new-members`, {
      params: {
        user_id: userId, // Pass the user's ID as a query parameter
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching new members:', error);
    throw error;
  }
};

// Fetch active members based on user's gender 
export const fetchActiveMembers = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/active-members`, {
      params: { user_id: userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching active members:', error);
    throw error;
  }
};

// Fetch close members (nearby) based on user's location
export const fetchCloseMembers = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/close-members`, {
      params: { user_id: userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching close members:', error);
    throw error;
  }
};

export const fetchUserIntroduction = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/introduction`);
    return response.data.introduction; // Return the introduction string
  } catch (error) {
    console.error('Error fetching user introduction:', error);
    throw error;
  }
};

// Save user introduction
export const saveUserIntroduction = async (userId, introduction) => {
  try {
    await axios.post(`${API_URL}/introduction`, {
      userId,
      introduction,
    });
  } catch (error) {
    console.error('Error saving user introduction:', error);
    throw error;
  }
};

export const fetchUserProfileByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile by user_id:', error);
    throw error;
  }
};

// Update user profile by user_id
export const saveUserProfileByUserId = async (userId, profileData) => {
  try {
    const response = await axios.put(`${API_URL}/user/${userId}`, profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile by user_id:', error);
    throw error;
  }
};

export const updateProfileActiveStatus = async (userId, profileActive) => {
  try {
    const response = await axios.put(`${API_URL}/profile-active/${userId}`, {
      profile_active: profileActive,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile active status:', error);
    throw error;
  }
};

export const fetchProfileActiveStatus = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/profile-active/${userId}`);
    return response.data.profile_active; // Assuming the response has a profile_active field
  } catch (error) {
    console.error('Error fetching profile active status:', error);
    throw error;
  }
};

export const fetchUserId = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/userid/${id}`);
    return response.data.user_id; // Retrieved user_id
  } catch (error) {
    console.error('Error fetching user_id:', error);
    throw error;
  }
};