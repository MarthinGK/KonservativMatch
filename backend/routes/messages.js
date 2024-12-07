const express = require('express');
const router = express.Router();
const {
    sendMessage, 
    fetchConversation, 
    fetchRecentConversations, 
    initiateConversation
} = require('../controllers/messagesController');

// Route to send a message
router.post('/send', sendMessage);

// Route to fetch a conversation between two users
router.get('/conversation', fetchConversation);

// Route to fetch recent conversations for a user
router.get('/recent', fetchRecentConversations);

router.post('/initiate', initiateConversation);

module.exports = router;
