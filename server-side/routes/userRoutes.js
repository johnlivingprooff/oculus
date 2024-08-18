const express = require('express');
const { authenticateUser, registerUser, loginUser, logoutUser } = require('../controllers/userController');
const router = express.Router();

router.post('/auth', authenticateUser);
router.post('/', registerUser);
router.post('/logout', logoutUser)

module.exports = router;
