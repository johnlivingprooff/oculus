const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { getDashboardData } = require('../controllers/dashController');

router.get('/dashboard', auth, getDashboardData);

module.exports = router;
