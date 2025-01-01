const express = require('express');
const router = express.Router();
const { checkOrCreateUser, 
        getProfileComplete, 
        saveUserProfile, 
        getNewMembers, 
        getActiveMembers, 
        getCloseMembers, 
        getUserProfile, 
        getPreviewProfile, 
        getUserIntroduction, 
        saveUserIntroduction, 
        getUserProfileByUserId, 
        saveUserProfileByUserId, 
        updateUserActivity, 
        updateProfileActiveStatus, 
        getProfileActiveStatus, 
        getUserIdById
      } = require('../controllers/userController');

// Route to check or create a user
router.post('/check', checkOrCreateUser);

router.post('/profile', saveUserProfile);

router.get('/new-members', getNewMembers);
router.get('/active-members', getActiveMembers);
router.get('/close-members', getCloseMembers);

router.get('/bruker/:brukerId', getUserProfile);
router.get('/preview-profile', getPreviewProfile);

router.get('/:userId/introduction', getUserIntroduction);
router.post('/introduction', saveUserIntroduction);

router.get('/user/:user_id', getUserProfileByUserId);
router.put('/user/:user_id', saveUserProfileByUserId);
router.get('/userid/:id', getUserIdById);

router.post('/update_activity', updateUserActivity);

router.put('/profile-active/:user_id', updateProfileActiveStatus);
router.get('/profile-active', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).send('Missing user ID');
  }

  try {
    const profileActive = await retryCheckProfileActive(userId);
    if (profileActive !== null) {
      res.status(200).json({ profile_active: profileActive });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send(`Error fetching profile_active status: ${error.message}`);
  }
});

const retryCheckProfileActive = async (userId, retries = 5, delay = 100) => {
  for (let i = 0; i < retries; i++) {
    try {
      const profileActive = await getProfileActiveStatus(userId); // Replace with your DB query function
      console.log("profile active status: ", profileActive)
      if (profileActive !== null) {
        return profileActive;
      }
    } catch (error) {
      console.error('Error fetching profile_active:', error);
    }
    await new Promise(resolve => setTimeout(resolve, delay)); // Delay between retries
  }
  throw new Error('User not found after multiple retries');
};

router.get('/profile_complete', async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(400).send('Missing user ID');
  }

  try {
    const profileComplete = await retryCheckProfileComplete(userId);
    if (profileComplete !== null) {
      res.status(200).json({ profile_complete: profileComplete });
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    res.status(500).send(`Error fetching profile_complete status: ${error.message}`);
  }
});

// Route to get profile complete status
const retryCheckProfileComplete = async (userId, retries = 5, delay = 100) => {
  for (let i = 0; i < retries; i++) {
    try {
      const profileComplete = await getProfileComplete(userId);
      console.log("profile complete status: ", profileComplete)
      if (profileComplete !== null) {
        return profileComplete;
      }
    } catch (error) {
      console.error('Error fetching profile_complete:', error);
    }
    await new Promise(resolve => setTimeout(resolve, delay)); // Delay between retries 
  }
  throw new Error('User not found after multiple retries');
};


module.exports = router;