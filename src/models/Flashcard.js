const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    topic: {
        type: String,
        unique: [true, 'This topic is already taken'],
        required: [true, 'Cannot be blank'],
        maxlength: 150,
    },
    author: {
        type: String,
        required: [true, 'Cannot be blank'],
        maxlength: 100,
    },
    question: {
        type: String,
        required: [true, 'Cannot be blank'],
        maxlength: 500,
    },
    answer: {
        type: String,
        required: [true, 'Cannot be blank'],
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        // type: String,
        ref: 'User',
        // required: [true]
    }
}, { timestamps: true });

module.exports = mongoose.model('Flashcard', flashcardSchema);