require('dotenv').config({path:'./env'})
require("express-async-errors");
const express = require('express');
const app = express();
const cors = require('cors')
const favicon = require('express-favicon');
const logger = require('morgan');
const cookieParser = require("cookie-parser");
const express = require("express");

const authenticateUser = require('./middleware/authentication');

const mainRouter = require('./routes/mainRouter.js');
const userRouter = require('./routes/User.js');
const flashcardsRouter = require('./routes/Flashcards.js');
const allUnauthFlashcardsRouter = require('./routes/flashcardsAllUnauth.js');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(cookieParser());

// routes
app.use('/api/v1', mainRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/flashcard', authenticateUser, flashcardsRouter);
app.use('/api/v1/flashcardsAll', allUnauthFlashcardsRouter);

module.exports = app;