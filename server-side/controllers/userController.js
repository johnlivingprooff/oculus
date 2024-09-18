const redisClient = require("../utils/redisClient");
const User = require("../models/User");
const { handleErrors } = require("../utils/errorHandler");
const { createAccessToken, createRefreshToken } = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

/**
 * description - Register a new user
 * route - POST /api/v1/users/auth/register
 * access - public
 */
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Create a new user in the database
    const user = await User.create({ username, email, password });

    // Generate JWT tokens
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    // Set refresh token in an httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: "Strict"
    });

    // Send the access token and user info in the response
    res.status(201).json({ user: user._id, accessToken: accessToken });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

/**
 * description - Authenticate a user
 * route - POST /api/v1/users/auth/login
 * access - public
 */
const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Authenticate user using User model's login method
    const user = await User.login(email, password);

    // Create JWT tokens
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    // Set refresh token in an httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // Use secure cookies in production
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: "None"
    });

    // Send the access token and user info in the response
    res.status(200).json({ user: user._id, accessToken: accessToken });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

/**
 * description - Logout a user
 * route - POST /api/v1/users/auth/logout
 * access - public
 */
const logoutUser = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  
  if (!refreshToken) {
    console.log("No refresh token found"); //debug
    return res.status(400).json({ message: "No refresh token found" });
  }

  try {
    // Decode refresh token and add to Redis blacklist
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    await redisClient.set(refreshToken, "blacklisted", "EX", 7 * 24 * 60 * 60); // Blacklist for 7 days

    // Clear refresh token cookie
    res.cookie("refreshToken", "", { maxAge: 1 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

/**
 * description - Refresh the access token
 * route - POST /api/v1/users/auth/refresh-token
 * access - public
 */
const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    // Check if refresh token is blacklisted
    const isBlacklisted = await redisClient.get(refreshToken);
    if (isBlacklisted) {
      return res.status(403).json({ message: "Blacklisted refresh token" });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Create a new access token
    const accessToken = createAccessToken(decoded.id);

    // Send the new access token
    res.status(200).json({ accessToken: accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

module.exports = {
  authenticateUser,
  registerUser,
  logoutUser,
  refreshToken,
};
