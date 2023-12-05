const Flashcard = require('../models/Flashcard');
const Deck = require('../models/Deck');
const { StatusCodes } = require('http-status-codes');

// get all decks by unauthenticated users
const getAllDecks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const offset = (page -1) * limit;
        const totalDecks = await Deck.countDocuments({ isPublic: true });
        const decks = await Deck.find({ isPublic: true })
            .sort('createdAt')
            .skip(offset)
            .limit(limit);

        res.status(StatusCodes.OK).json({
            decks,
            currentPage: page,
            totalPages: Math.ceil(totalDecks / limit),
            totalItems: totalDecks,
        });

    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal server error'});
    }
};

// get all user decks
const getUserDecks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const offset = (page - 1) * limit;
        const totalDecks = await Deck.countDocuments({ createdBy: req.user.userId });
        const decks = await Deck.find({ createdBy: req.user.userId })
            .sort('createdAt')
            .skip(offset)
            .limit(limit);

        res.status(StatusCodes.OK).json({
            decks,
            currentPage: page,
            totalPages: Math.ceil(totalDecks / limit),
            totalItems: totalDecks,
        });

    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal server error'});
    }
};

// get detailed deck information along with flashcards 
const getDeckWithFlashcards = async (req, res) => {
    console.log("req params is:", req.params)
    try {
        const deckId = req.params.id; 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const deck = await Deck.findById(deckId)
            .populate({
                path: 'flashcards',
                options: { skip, limit },
            });

        if (!deck) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: `No deck with id ${deckId}` });
        }
        
        // Flatten the array of arrays of flashcard IDs
        const flatFlashcardIds = deck.flashcards.flat();

        // Map over the flat array of flashcard IDs to fetch the detailed flashcards
        const detailedFlashcards = await Promise.all(flatFlashcardIds.map(async flashcardId => {
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

        res.status(StatusCodes.OK).json({
            deck: {
                _id: deck._id,
                topic: deck.topic,
                subtopic: deck.subtopic,
                isPublic: deck.isPublic,
                createdBy: deck.createdBy,
                flashcards: detailedFlashcards,
                createdAt: deck.createdAt,
                updatedAt: deck.updatedAt,
                __v: deck.__v,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal server error' })
    }
};

// create deck according to the schema
const createDeck = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const deck = await Deck.create(req.body);
    res.status(StatusCodes.CREATED).json({ deck });
};

// update deck
const updateDeck = async (req, res) => {
    const {
        body: { topic, subtopic, isPublic, createdBy, flashcards },
        user: { userId },
        params: { id: deckId }
    } = req;

    const updatedFields = {};

    if (topic !== undefined) {
        updatedFields.topic = topic;
    }

    if (subtopic !== undefined) {
        updatedFields.subtopic = subtopic;
    }

    if (isPublic !== undefined) {
        updatedFields.isPublic = isPublic;
    }

    if (flashcards !== undefined) {
        updatedFields.flashcards = flashcards;
    }

    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ msg: 'No fields to update' })
    }

    try {
        const deck = await Deck.findOneAndUpdate(
            { _id: deckId, createdBy: userId },
            { $set: updatedFields },
            { new: true, runValidators: true }
        );

        if (!deck) {
            return res.status(404).json({ msg: `No deck with id ${deckId}` });
        }

        res.status(StatusCodes.OK).json({ deck });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal server error' });
    }
};

// delete deck
const deleteDeck = async (req, res) => {
    const {
        user: { userId },
        params: { id: deckId }
    } = req;

    const deck = await Deck.findOneAndDelete(
        { _id: deckId, createdBy: userId }
    );

    if (!deck) {
        return res.status(StatusCodes.NOT_FOUND).json({ msg: `No deck with id ${deckId}` });
    };

    res.status(StatusCodes.OK).json({ msg: 'Deck deleted' });
};

module.exports = {
    getAllDecks,
    getUserDecks,
    getDeckWithFlashcards,
    createDeck,
    updateDeck,
    deleteDeck
}