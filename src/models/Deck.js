const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
    topic: {
        type: String,
        required: [true, 'Topic cannot be blank'],
        maxlength: 300,
    },
    subtopic: {
        type: String,
        maxlength: 300,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    flashcards: [{
        type: mongoose.Types.ObjectId,
        ref: 'Flashcard',
    }],
}, { timestamps: true });

module.exports = mongoose.model('Deck', deckSchema);