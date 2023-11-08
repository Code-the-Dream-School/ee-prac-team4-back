const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: [true, 'Cannot be blank'],
        enum: ['Ruby on Rails', 'Node.js', 'React', 'HTML', 'CSS', 'Express'],
        maxlength: 150,
    },
    question: {
        type: String,
        required: [true, 'Cannot be blank'],
        maxlength: 500,
    },
    answer: {
        type: String,
        required: [true, 'Cannot be blank'],
        maxlength: 500,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

module.exports = mongoose.model('Flashcard', flashcardSchema);

// type: String,
//         required: [true, 'Cannot be blank'],
//         match: [/^[a-zA-Z0-9]+$/, 'Username is invalid'],
//         unique: [true, 'This username is already taken'],
//         maxlength: 50,