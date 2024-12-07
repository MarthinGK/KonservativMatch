const express = require('express');
const router = express.Router();
const {
    grantPermission, 
    checkPermission, 
    revokePermission
} = require('../controllers/permissionsController');

// Route to grant permission
router.post('/grant', grantPermission);

// Route to check permission
router.get('/check', checkPermission);

// Route to revoke permission
router.post('/revoke', revokePermission);

module.exports = router;
