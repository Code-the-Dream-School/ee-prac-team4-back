const Flashcard = require('../models/Flashcard');
const User = require('../models/User');

// function to get detailed flashcards
const getDetailedFlashcards = async (flashcardIds) => {
    // error handling for cases when no detailed flashcards are returned
    const flatFlashcardIds = flashcardIds ? flashcardIds.flat() : [];

    const detailedFlashcards = await Promise.all(flatFlashcardIds.map(async (flashcardId) => {
        const detailedFlashcard = await Flashcard.findById(flashcardId);
        
        if (detailedFlashcard) {
            return {
                _id: detailedFlashcard._id,
                question: detailedFlashcard.question,
                answer: detailedFlashcard.answer,
                resources: detailedFlashcard.resources,
                hint: detailedFlashcard.hint,
                deck: detailedFlashcard.deck,
            };
        } else {
            return null;
        }
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