const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: [true, 'Cannot be blank'],
        enum: ['Ruby on Rails', 'Node.js', 'React', 'HTML', 'CSS', 'Express'],
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
    resources: {
        type: String,
        required: [false],
        maxlength: 500,
    },
    hint: {
        type: String,
        required: [false],
        maxlength: 500,
    },
    decks: {
        type: [String],
        maxlength: 100,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

module.exports = mongoose.model('Flashcard', flashcardSchema);