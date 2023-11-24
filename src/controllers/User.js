const User = require('../models/User');
const { createJWT } = require('./auth');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const cookies = require('cookie');

const getById = async (req, res) => {
    try {
        // extract userId from the route params
        const userId = req.params.id;

        // fetch the user by Id
        const user = await User.findById(userId);

        // check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // if user exists
        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const register = async (req, res) => {
    const { username, firstName, lastName, role, email, password } = req.body;

    try {
        // check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user with the hashed password
        const newUser = new User({
            username,
            firstName,
            lastName,
            role,
            email,
            password: hashedPassword,
        });

        // save the user to the database
        await newUser.save();

        // generate a JWT token for the newly registered user
        const token = createJWT(newUser);

        res.status(StatusCodes.CREATED).json({ user: { username: newUser.username }, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create a JWT - JSON Web Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { // or username
            expiresIn: process.env.JWT_LIFETIME,
        });

        req.user = { userId: user._id };

        res.setHeader(
            'Set-Cookie',
            cookies.serialize('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600,
                path: '/',
            })
        );

        // Send the JWT token in the response
        res.status(200).json({ user: { username: user.username }, token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' })
    }
};

const logout = async (req, res) => {
    return res
        .clearCookie('token')
        .status(200)
        .json({ msg: 'Successfully logged out' })
}

module.exports = { getById, login, register, logout };