const express = require('express');
const router = express.Router();
const { fetchWeather } = require('../controllers/weatherController');

router.get('/', fetchWeather);

module.exports = router;
