require('dotenv').config({path:'./env'})
require("express-async-errors");
const express = require('express');
const app = express();
const cors = require('cors')
const favicon = require('express-favicon');
const logger = require('morgan');
const cookieParser = require("cookie-parser");

// swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const authenticateUser = require('./middleware/authentication');

const mainRouter = require('./routes/mainRouter.js');
const userRouter = require('./routes/User.js');
const flashcardsRouter = require('./routes/Flashcards.js');
const allUnauthFlashcardsRouter = require('./routes/flashcardsAllUnauth.js');
const decksRouter = require('./routes/Decks.js');
const allUnauthDecksRouter = require('./routes/decksAllUnauth');
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/not-found');

// middleware
app.use(cors({
    origin: process.env.FLASHCARDS_API_BASE_URL,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cookieParser(process.env.JWT_SECRET));

const resourcesRouter = require('./routes/Resources');
const unathorizedResourceRouter = require('./routes/UnauthorizedResources');

// routes
app.use('/api/v1', mainRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/flashcard', authenticateUser, flashcardsRouter);
app.use('/api/v1/flashcardsAll', allUnauthFlashcardsRouter); 
app.use('/api/v1/deck', authenticateUser, decksRouter);
app.use('/api/v1/decksAll', allUnauthDecksRouter);  
app.use('/api/v1/resources', authenticateUser, resourcesRouter);
app.use('/api/v1/unathresources', unathorizedResourceRouter);   

// swagger link
app.use('/api/v1/api-docs', swaggerUI.serve);
app.get('/api/v1/api-docs', swaggerUI.setup(swaggerDocument));

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

module.exports = app;