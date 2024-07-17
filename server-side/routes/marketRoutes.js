const express = require('express');
const router = express.Router();
const { collateMarketInsights } = require('../controllers/marketController');

router.get('/fields/:fieldId/market_insights', collateMarketInsights);

module.exports = router;
