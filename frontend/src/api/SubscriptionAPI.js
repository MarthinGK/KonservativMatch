import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Adjust according to your backend URL

// Fetch subscription status for a user
export const getSubscriptionStatus = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subscription/${userId}/status`);
    return response.data; // Returns subscription data (status, plan, dates)
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw error;
  }
};

// Update subscription for a user
export const updateSubscription = async (userId, subscriptionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/subscription/${userId}/update`, subscriptionData);
    return response.data; // Returns success message
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};


// Update auto-renewal status for a user
export const updateAutoRenewal = async (userId, autoRenew) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/subscription/${userId}/auto-renew`, { autoRenew });
    return response.data; // Returns success message
  } catch (error) {
    console.error('Error updating auto-renewal:', error);
    throw error;
  }
};

// Upgrade subscription plan for a user
export const upgradeSubscription = async (userId, newPlan) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/subscription/${userId}/upgrade`, { newPlan });
    return response.data; // Returns success message
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    throw error;
  }
};