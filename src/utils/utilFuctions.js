const Flashcard = require('../models/Flashcard');
const User = require('../models/User');

// function to get detailed flashcards
const getDetailedFlashcards = async (flashcardIds) => {
    const flatFlashcardIds = flashcardIds.flat();

    const detailedFlashcards = await Promise.all(flatFlashcardIds.map(async (flashcardId) => {
        const detailedFlashcard = await Flashcard.findById(flashcardId);
        return {
            _id: detailedFlashcard._id,
            question: detailedFlashcard.question,
            answer: detailedFlashcard.answer,
            resources: detailedFlashcard.resources,
            hint: detailedFlashcard.hint,
            deck: detailedFlashcard.deck,
        };
    }));

    return detailedFlashcards;
};

const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        return user || {};
    } catch (error) {
        console.error('Error finding user:', error);
        return {};
    }
};

module.exports = { getDetailedFlashcards, getUserById };