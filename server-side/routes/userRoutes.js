const express = require('express');
const auth = require('../middlewares/authMiddleware');
const { authenticateUser, registerUser, logoutUser, refreshToken } = require('../controllers/userController');
const router = express.Router();

router.post('/auth/login', auth, authenticateUser);
router.post('/auth/register', auth, registerUser);
router.post('/auth/refresh-token', auth, refreshToken);
router.post('/auth/logout', auth, logoutUser);

module.exports = router;
