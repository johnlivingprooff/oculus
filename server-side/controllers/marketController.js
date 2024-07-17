const Field = require('../models/Field');

/**
 * description: generate random market insights for all fields
 * 
 * @returns market insight data
 */
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];

const generateDummyMarketInsight = () => {

    const priceTrends = ['upward', 'steady', 'downward'];
    const demands = ['high', 'medium', 'low'];
    const supplies = ['low', 'medium', 'high'];

    return {
        currentPrice: Math.floor(Math.random() * 300) + 50, // Random price between 50 and 350
        priceTrend: getRandomElement(priceTrends),
        demand: getRandomElement(demands),
        supply: getRandomElement(supplies)
    };
};

/**
 * description: collate random market insights for a field
 * route: GET /api/v1/fields/:fieldId/market_insights
 * access: private
 */
const collateMarketInsights = async (req, res) => {
    const { fieldId } = req.params;

    try {
        const field = await Field.findById(fieldId);
        if (!field) {
            return res.status(404).json({ message: 'Field not found' });
        }

        const insights = generateDummyMarketInsight();
        field.marketInsights = insights;
        await field.save();

        console.log(field.marketInsights);
    
        // problem here not sure what it is...
        res.status(200).json(marketInsights);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

module.exports = { collateMarketInsights };
