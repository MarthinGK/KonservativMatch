const pool = require('../db');

// Fetch subscription status
const getSubscriptionStatus = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the subscription details
    const result = await pool.query(
      'SELECT status, start_date, end_date, payment_method, amount, auto_renew, subscription_type FROM subscriptions WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No subscription found' });
    }

    const { status, start_date, end_date, payment_method, amount, auto_renew, subscription_type } = result.rows[0];
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
      payment_method, 
      amount, 
      auto_renew, 
      subscription_type
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

const updateAutoRenewal = async (req, res) => {
  const { userId } = req.params;
  const { autoRenew } = req.body;

  if (typeof autoRenew !== 'boolean') {
    return res.status(400).json({ message: 'Invalid auto-renewal value' });
  }

  try {
    const query = `
      UPDATE subscriptions
      SET auto_renew = $1
      WHERE user_id = $2
      RETURNING auto_renew;
    `;
    const result = await pool.query(query, [autoRenew, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Subscription not found for the user' });
    }

    res.status(200).json({
      message: 'Auto-renewal updated successfully',
      autoRenew: result.rows[0].auto_renew,
    });
  } catch (error) {
    console.error('Error updating auto-renewal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Upgrade subscription plan for a user
const upgradeSubscription = async (req, res) => {
  const { userId } = req.params;
  const { newPlan } = req.body;

  const plans = {
    '1 month': { duration: '1 month', amount: 129 },
    '3 months': { duration: '3 months', amount: 357 },
    '6 months': { duration: '6 months', amount: 714 },
  };

  if (!plans[newPlan]) {
    return res.status(400).json({ message: 'Invalid subscription plan' });
  }

  try {
    const query = `
      UPDATE subscriptions
      SET subscription_type = $1,
          start_date = CURRENT_TIMESTAMP,
          end_date = CURRENT_TIMESTAMP + INTERVAL $2,
          amount = $3
      WHERE user_id = $4
      RETURNING subscription_type, start_date, end_date, amount;
    `;
    const result = await pool.query(query, [newPlan, plans[newPlan].duration, plans[newPlan].amount, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Subscription not found for the user' });
    }

    res.status(200).json({
      message: 'Subscription upgraded successfully',
      subscription: result.rows[0],
    });
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  getSubscriptionStatus,
  updateSubscriptionStatus,
  validateSubscription, 
  updateAutoRenewal, 
  upgradeSubscription
};
