const Field = require('../models/Field');
const { getWeather } = require('./weatherController');

/**
 * description - gather dashboard data
 * route - GET /api/v1/dashboard
 * access - private(user)
 */
const getDashboardData = async (req, res) => {
    const userId = req.user.id;

    try {
        // fetch fields data
        const fields = await Field.find({ userId });

        // fetch weather data
        const weatherPromises = fields.map(field => getWeather(field.fieldLocation));
        const weatherData = await Promise.all(weatherPromises);

        // organize data for front end
        const dashboardData = {
            fields,
            weather: weatherData
        };

        res.status(200).json(dashboardData);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', err });
    }
};

module.exports = { getDashboardData };