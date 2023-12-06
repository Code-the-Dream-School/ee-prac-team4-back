const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function createJWT(user, expiresIn) {
    expiresIn = expiresIn || process.env.JWT_LIFETIME;
    return jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        {
            expiresIn: expiresIn,
        }
    );
}

module.exports = { createJWT };