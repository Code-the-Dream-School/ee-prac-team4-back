const jwt = require('jsonwebtoken')
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());

const auth = async (req, res, next) => {
    // check header
    const token = req.cookies.JWT_SECRET
    if (!token) {
        return res.status(403).json({ message: 'Authentication invalid' });
    }
    console.log('Before try block');
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET)
       
        req.userId = { userId: data.userId }
        console.log(req.userId)
        next()
    } catch (error) {
        console.log('Error in auth middleware:', error);
        return res.status(403).json({ message: 'Authentication invalid' });
    }
}

module.exports = auth;