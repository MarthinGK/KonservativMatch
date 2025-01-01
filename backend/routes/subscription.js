const express = require('express');
const router = express.Router();
const {
  getSubscriptionStatus,
  updateSubscriptionStatus,
  validateSubscription,
} = require('../controllers/subscriptionController');

// Fetch subscription status
router.get('/:userId/status', getSubscriptionStatus);

// Update subscription status
router.post('/:userId/update', updateSubscriptionStatus);

// Middleware for validating subscription (to protect routes)
router.use('/premium-content', validateSubscription, (req, res) => {
  res.json({ message: 'Welcome to premium content!' });
});

module.exports = router;
