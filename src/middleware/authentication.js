// const jwt = require('jsonwebtoken')

// const auth = async (req, res, next) => {
//     // check header
//     const authHeader = req.headers.authorization
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'Authentication invalid' });
//     }

//     const token = authHeader.split(' ')[1]

//     try {
//         const payload = jwt.verify(token, process.env.JWT_SECRET)
       
//         req.user = { userId: payload.userId }
//         next()
//     } catch (error) {
//         return res.status(401).json({ message: 'Authentication invalid' });
//     }
// }

// module.exports = auth

// const cookieParser = require("cookie-parser");
// const express = require("express");


const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    console.log('Request Cookies:', req.cookies);
    const token = req.cookies.token;
    
    if (!token) {
        console.log('No token found in cookies');
        return res.status(401).json({ message: 'Authentication invalid' });
    }
    
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // req.userId = payload.userId;
        req.user = { userId: payload.userId };

        // const user = await User.findById(userId);

        // if (!user) {
        //     return res.status(401).json({ msg: 'User not found' })
        // }

        // set the auth user's data in req.user
        // req.user = user;

        next();
    } catch (error) {
        console.log('JWT Verification Error:', error);
        return res.status(401).json({ message: 'Authentication invalid' });
    }
};

module.exports = auth;