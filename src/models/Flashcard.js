const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    topic: {
        type: String,
        unique: [true, 'This topic is already taken'],
        required: [true, 'Cannot be blank'],
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