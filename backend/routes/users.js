const express = require('express');
const router = express.Router();
const { checkOrCreateUser, getProfileComplete } = require('../controllers/userController');

// Route to check or create a user
router.post('/check', checkOrCreateUser);

// Route to get profile complete status
router.get('/profile_complete', async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).send('Missing user ID');
  }

  try {
    const profileComplete = await getProfileComplete(req);
    if (profileComplete !== null) {
      res.status(200).json({ profile_complete: profileComplete });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error fetching profile_complete status:', error);
    res.status(500).send(`Error fetching profile_complete status: ${error.message}`);
  }
});

module.exports = router;