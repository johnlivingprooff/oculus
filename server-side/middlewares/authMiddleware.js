const jwt = require('jsonwebtoken');
const User = require("../models/User");

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access Denied. No token provided.' });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken.id);

        if (!user) {
            return res.status(401).json({ message: 'Invalid token. User does not exist.' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized access.', error: err.message });
    }
};

module.exports = auth;
