const Flashcard = require('../models/Flashcard');
const User = require('../models/User');

// function to get detailed flashcards
const getDetailedFlashcards = async (flashcardIds) => {
    const flatFlashcardIds = flashcardIds.flat();

    const detailedFlashcards = await Promise.all(flatFlashcardIds.map(async (flashcardId) => {
        const detailedFlashcard = await Flashcard.findById(flashcardId);

        if (!detailedFlashcard || !detailedFlashcard.createdBy) {
            console.error('Invalid flashcard or createdBy property missing:', detailedFlashcard);
            return null;
        }

        const createdByUser = await getUserById(detailedFlashcard.createdBy);

        if (!createdByUser) {
            console.error('User not found for flashcard createdBy:', detailedFlashcard.createdBy);
            return null;
        }

        return {
            _id: detailedFlashcard._id,
            question: detailedFlashcard.question,
            answer: detailedFlashcard.answer,
            resources: detailedFlashcard.resources,
            hint: detailedFlashcard.hint,
            deck: detailedFlashcard.deck,
            createdBy: createdByUser._id,
        };
    }));

    return detailedFlashcards;
};

const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            console.error('User not found with ID:', userId);
            return null; 
        }

        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        return null;
    }
};

module.exports = { getDetailedFlashcards, getUserById };