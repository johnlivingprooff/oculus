const axios = require('axios');

const apiKey = process.env.WEATHER_API_KEY;
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

// Helper function for fetching weather data
const getWeather = async (location) => {
  try {
    const response = await axios.get(`${baseUrl}?q=${location}&appid=${apiKey}&units=metric`);
    return response.data;
  } catch (err) {
    console.error('Error fetching weather data:', err);
    throw err;
  }
};

/* 
* description - to get weather data from openweathermap api
* route - GET /api/v1/weather
* access - users
*/
const fetchWeather = async (req, res) => {
    const location = req.query.location || 'Lilongwe';

    try {
        const weather = await getWeather(location);
        res.json(weather);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching weather data' });
    }
};

module.exports = { fetchWeather, getWeather };
