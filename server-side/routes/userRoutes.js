const express = require('express');
const { authenticateUser, registerUser, logoutUser, refreshToken } = require('../controllers/userController');
const router = express.Router();

router.post('/auth/login', authenticateUser);
router.post('/auth/register', registerUser);
router.post('/auth/refresh-token', refreshToken);
router.post('/auth/logout', logoutUser);

module.exports = router;
