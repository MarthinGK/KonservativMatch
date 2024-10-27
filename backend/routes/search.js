const express = require('express');
const router = express.Router();
const { searchProfiles } = require('../controllers/searchController');

// GET route for searching profiles
router.get('/fetch-profiles', searchProfiles);

module.exports = router;