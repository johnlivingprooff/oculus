const redis = require("redis");

// Create and configure Redis client
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = redis.createClient({
  url: redisUrl,
});

// Parse the Redis port from the URL
const parsedUrl = new URL(redisUrl);
const redisPort = parsedUrl.port || 6379;  // Default Redis port is 6379

// Event Listeners for Redis Connection
redisClient.on("connect", () => {
  console.log(`Redis connected on port ${redisPort}`);
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

redisClient.on("ready", () => {
  console.log("Redis is ready to accept commands.");
});

redisClient.on("end", () => {
  console.log("Redis connection closed.");
});

// Connect to Redis
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
})();

// Export the Redis client for use in other files
module.exports = redisClient;
