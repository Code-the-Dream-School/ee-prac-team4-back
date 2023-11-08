const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    console.log('Request Cookies:', req.cookies);
    const token = req.cookies.token;
    
    if (!token) {
        console.log('No token found in cookies');
        return res.status(401).json({ message: 'Authentication invalid' });
    }
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId };
        next();
    } catch (error) {
        console.log('JWT Verification Error:', error);
        return res.status(401).json({ message: 'Authentication invalid' });
    }
};

module.exports = auth;