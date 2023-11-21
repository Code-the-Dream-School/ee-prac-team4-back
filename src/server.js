require('dotenv').config();
const { PORT = 8000 } = process.env;
const app = require("./app");
const connectDB = require('./db/connect');
bodyParser = require("body-parser"),
swaggerJsdoc = require("swagger-jsdoc"),
swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
      openapi: "3.1.0",
      info: {
        title: "Flashkards Express API with Swagger",
        version: "0.1.0",
        description:
          "This is a CRUD API application for IT students and mentors for creating and using decks with flashcards to make the learning easier. It is made with Express and documented with Swagger",
        license: {
          name: "MIT",
          url: "https://spdx.org/licenses/MIT.html",
        },
        contact: {
          name: "LogRocket",
          url: "https://logrocket.com",
          email: "info@email.com",
        },
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["./routes/*.js"],
  };
  
  const specs = swaggerJsdoc(options);
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
  );

const listener = () => console.log(`Listening on Port ${PORT}!`);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, listener);
    }  catch (error) {
        console.log(error);
    }
};

start();