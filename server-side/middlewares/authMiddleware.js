const jwt = require('jsonwebtoken');
const User = require("../models/User");

const auth = (req, res, next) => {
    const token = req.cookies.jwt

    // Check if jsonwebtoken exists && is verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.redirect('/');
            } else {
                let user = await User.findById( decodedToken.id);
                req.user = user;
                next();
            }
        })
    } else {
        res.redirect('/');
    }
}

module.exports = auth;