const express = require('express');
const app = express();
const cors = require('cors')
const favicon = require('express-favicon');
const logger = require('morgan');
const cookieParser = require("cookie-parser");

const authenticateUser = require('./middleware/authentication');

// routers
const mainRouter = require('./routes/mainRouter.js');
const userRouter = require('./routes/User.js');
const flashcardsRouter = require('./routes/Flashcards.js');
const allUnauthFlashcardsRouter = require('./routes/flashcardsAllUnauth.js');
const decksRouter = require('./routes/Decks.js');
const allUnauthDecksRouter = require('./routes/decksAllUnauth');

// swagger
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require("swagger-jsdoc")

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Flashcards API",
            version: "1.0.0",
            description: "An Express Flashcards API"
        },
        servers: [
            {
                url: "http://localhost:8000"
            }
        ],
    },
    apis: ["./src/routes/*.js"],
};

const specs = swaggerJsDoc(options)

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.static('public'))
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(cookieParser());

// routes
app.use('/api/v1', mainRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/flashcard', authenticateUser, flashcardsRouter);
app.use('/api/v1/deck', authenticateUser, decksRouter);
app.use('/api/v1/flashcardsAll', allUnauthFlashcardsRouter);
app.use('/api/v1/decksAll', allUnauthDecksRouter);

app.use("/api/v1/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

module.exports = app;