const mongoose = require('mongoose');

const connectDB = async () => {
  const url = 'mongodb+srv://jukaririchardson:TwentyTwenty3*@cluster0.yjrtwue.mongodb.net/';

  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
    //   useCreateIndex: true,
    //   useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;  // Propagate the error so that the calling code can handle it
  }
};

module.exports = connectDB;
