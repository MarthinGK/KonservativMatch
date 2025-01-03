const express = require('express');
const router = express.Router();
const {
  getSubscriptionStatus,
  updateSubscriptionStatus,
  validateSubscription, 
  updateAutoRenewal,
  upgradeSubscription
} = require('../controllers/subscriptionController');

// Fetch subscription status
router.get('/:userId/status', getSubscriptionStatus);

// Update subscription status
router.post('/:userId/update', updateSubscriptionStatus);

// Update auto-renewal status
router.post('/:userId/auto-renew', updateAutoRenewal);

// Upgrade subscription plan
router.post('/:userId/upgrade', upgradeSubscription);

// Middleware for validating subscription (to protect routes)
router.use('/premium-content', validateSubscription, (req, res) => {
  res.json({ message: 'Welcome to premium content!' });
});

module.exports = router;
