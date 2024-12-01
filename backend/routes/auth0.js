const express = require('express');
const router = express.Router();
const { updateUserEmail } = require('../controllers/auth0Controller');

router.put('/update_email', updateUserEmail);

module.exports = router;