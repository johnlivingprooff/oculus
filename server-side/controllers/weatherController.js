const axios = require('axios');
const redis = require('redis');
const { promisify } = require('util');

// Create a Redis client and handle connection
const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('ready', () => {
  console.log('Redis client ready');
});

redisClient.connect();

const getAsync = promisify(redisClient.get).bind(redisClient);

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
    const cacheKey = `weather:${location}`;

    try {
        // Check if data is in cache
        const cachedData = await getAsync(cacheKey);
        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        // Fetch data from API if not in cache
        const weather = await getWeather(location);
        
        // Store the fetched data in cache for 1 hour (3600 seconds)
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(weather));

        res.json(weather);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching weather data' });
    }
};

module.exports = { fetchWeather, getWeather };
