import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL; // Adjust according to your backend URL

// Fetch subscription status for a user
export const getSubscriptionStatus = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/subscriptions/${userId}/status`);
    return response.data; // Returns subscription data (status, plan, dates)
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw error;
  }
};

// Update subscription for a user
export const updateSubscription = async (userId, subscriptionData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/subscriptions/${userId}/update`, subscriptionData);
    return response.data; // Returns success message
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

// Example usage in your app:
// getSubscriptionStatus(userId)
// updateSubscription(userId, { status: 'active', plan: 'Premium', startDate: '2023-01-01', endDate: '2023-03-31' })
