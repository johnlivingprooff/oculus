const User = require("../models/User");
const { handleErrors } = require("../utils/errorHandler");
const createToken = require("../utils/generateToken");

/**
 * description - Authenticat a user
 * route - POST /api/v1/users/auth
 * access - public
 */

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 3,
    });
    res.status(200).json({ user: user._id, token: token });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

/**
 * description - Register a new user
 * route - POST /api/v1/users/
 * access - public
 */

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.create({ username, email, password });

    const token = createToken(user._id);

    // Setting cookie
    res.cookie("jwt", token, {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: true,
    });
    res.status(201).json({ user: user._id });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

/**
 * description -Logout a user
 * route - POST /api/v1/users/logout
 * access - public
 */

const logoutUser = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
  authenticateUser,
  registerUser,
  logoutUser,
};