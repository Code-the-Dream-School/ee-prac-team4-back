const User = require('../models/User');
const Deck = require('../models/Deck');
const { createJWT } = require('./auth');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs');
const cookies = require('cookie');

const getById = async (req, res) => {
    try {
        // extract userId from the route params
        const userId = req.params.id;

        // check if userId is defined
        if (!userId) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        // fetch the user by id
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
    const { username, email, firstName, lastName, role, password } = req.body;

    try {
        // check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user with the hashed password
        const newUser = new User({
            username,
            email,
            firstName,
            lastName,
            role,
            password: hashedPassword,
        });

        // save the user to the database
        await newUser.save();

        // generate a JWT token for the newly registered user
        const expirationSeconds = process.env.JWT_LIFETIME;
        const token = createJWT(newUser, expirationSeconds);

        const expirationMs = expirationSeconds * 1000

        res.status(StatusCodes.CREATED).json({ user: { 
            username: newUser.username,
            createdBy: newUser.createdBy,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role 
        }, 
            userId:newUser._id, 
            token, 
            expiresIn: expirationMs,
        });
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
        const expirationSec = process.env.JWT_LIFETIME
        const token = createJWT(user, expirationSec);

        res.setHeader(
            'Set-Cookie',
            cookies.serialize('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: expirationSec,
                path: '/'
            })
        );

        // Send the JWT token in the response
        res.status(200).json({ 
            user: { 
                username: user.username,
                createdBy: user.createdBy,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }, 
                userId:user._id, 
                token,
                expiresIn: expirationSec * 1000,
            });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' })
    }
};

// getFavoriteDecks
const getFavoriteDecks = async (req, res) => {
    try {
        const userId = req.params.id; 

        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }

        const favoriteDeckIds = user.favorite_decks;

        const favoriteDecks = await Deck.find({ _id: { $in: favoriteDeckIds } });

        res.status(StatusCodes.OK).json({ favoriteDecks });

    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

const logout = async (req, res) => {
    return res
        .clearCookie('token')
        .status(200)
        .json({ msg: 'Successfully logged out' })
}

module.exports = { getById, login, register, getFavoriteDecks, logout };