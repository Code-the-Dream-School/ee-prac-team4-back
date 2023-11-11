const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: [true, 'Topic field cannot be blank'],
        enum: ['Ruby on Rails', 'Node.js', 'React', 'HTML', 'CSS', 'Express'],
    },
    question: {
        type: String,
        required: [true, 'Question field cannot be blank'],
        maxlength: 500,
    },
    answer: {
        type: String,
        required: [true, 'Answer field cannot be blank'],
        maxlength: 500,
    },
    resources: {
        type: String,
        maxlength: 500,
    },
    hint: {
        type: String,
        maxlength: 500,
    },
    deck: {
        type: mongoose.Types.ObjectId,
        ref: 'Deck',
        required: true,
},
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true],
    }
}, { timestamps: true });

module.exports = mongoose.model('Flashcard', flashcardSchema);