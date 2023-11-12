const connectDB = require('../db/connect');
const { PORT = 8000 } = process.env;
const app = require("./app");

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI)
      app.listen(PORT,
        console.log(`Server is listening on port ${PORT}...`)
      )
    } catch (error) {
      console.log(error);
    }
  }
  
  start();
  