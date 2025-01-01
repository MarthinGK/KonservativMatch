const pool = require('../db');

// Fetch subscription status
const getSubscriptionStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT status, start_date, end_date FROM subscriptions WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update subscription status
const updateSubscriptionStatus = async (req, res) => {
  const { userId } = req.params;
  const { status, plan, startDate, endDate } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO subscriptions (user_id, status, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE
       SET status = $2, plan = $3, start_date = $4, end_date = $5`,
      [userId, status, plan, startDate, endDate]
    );

    res.status(200).json({ message: 'Subscription updated successfully' });
  } catch (error) {
    console.error('Error updating subscription status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Validate subscription
const validateSubscription = async (req, res, next) => {
  const { userId } = req.user; // Assuming user data is available from authentication middleware

  try {
    const result = await pool.query(
      'SELECT subscription_status, end_date FROM subscriptions WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0 || result.rows[0].subscription_status !== 'active') {
      return res.status(403).json({ message: 'Premium subscription required' });
    }

    const isExpired = new Date(result.rows[0].end_date) < new Date();
    if (isExpired) {
      return res.status(403).json({ message: 'Subscription has expired' });
    }

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error('Error validating subscription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getSubscriptionStatus,
  updateSubscriptionStatus,
  validateSubscription,
};
