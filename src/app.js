require('dotenv').config({path:'./env'})
require("express-async-errors");
const express = require('express');
const app = express();
const cors = require('cors')
const favicon = require('express-favicon');
const logger = require('morgan');

const authenticateUser = require('../middleware/authentication');

const mainRouter = require('./routes/mainRouter.js');
const errorHandlerMiddleware = require('../middleware/error-handler');
const notFoundMiddleware = require('../middleware/not-found');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
app.use(authenticateUser);

// routes
app.use('/api/v1', mainRouter);

module.exports = app;