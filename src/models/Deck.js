const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title cannot be blank'],
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