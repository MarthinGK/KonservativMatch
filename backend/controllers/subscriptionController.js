const pool = require('../db');

// Fetch subscription status
const getSubscriptionStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the subscription details
    const result = await pool.query(
      'SELECT status, start_date, end_date FROM subscriptions WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    const { status, start_date, end_date } = result.rows[0];
    const currentTimestamp = new Date();

    // Calculate the current status
    const newStatus = end_date > currentTimestamp ? 'active' : 'inactive';

    // If the status has changed, update it in the database
    if (status !== newStatus) {
      await pool.query(
        'UPDATE subscriptions SET status = $1 WHERE user_id = $2',
        [newStatus, userId]
      );
    }

    // Return the updated status
    res.json({
      status: newStatus,
      start_date,
      end_date,
    });
  } catch (error) {
    console.error('Error fetching or updating subscription status:', error);
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
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE
       SET status = $2, start_date = $3, end_date = $4`,
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
