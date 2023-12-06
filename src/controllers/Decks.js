const Flashcard = require('../models/Flashcard');
const User = require('../controllers/User');
const Deck = require('../models/Deck');
const { StatusCodes } = require('http-status-codes');
const { getDetailedFlashcards } = require('../utils/utilFuctions')

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

            const decksWithDetailedFlashcards = await Promise.all(decks.map(async (deck) => {
                const detailedFlashcards = await getDetailedFlashcards(deck.flashcards);
                return {
                    ...deck.toObject(),
                    flashcards: detailedFlashcards,
                };
            }));
    
        res.status(StatusCodes.OK).json({
            decks: decksWithDetailedFlashcards,
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

    try {
        if (!req.user || !req.user.userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid user ID' });
        }
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const user = await User.getById(req.user.userId);

        const offset = (page - 1) * limit;
        const totalDecks = await Deck.countDocuments({ createdBy: req.user.userId });
        const decks = await Deck.find({ createdBy: req.user.userId })
            .sort('createdAt')
            .skip(offset)
            .limit(limit);

            // Fetch detailed flashcards for each deck
            const decksWithDetailedFlashcards = await Promise.all(decks.map(async (deck) => {
                const detailedFlashcards = await getDetailedFlashcards(deck.flashcards);
    
                // Decorate each deck with detailed flashcards
                return {
                    ...deck.toObject(),
                    flashcards: detailedFlashcards,
                };
            }));

            // this is a decorator
            const usersFavorites = user.favorite_decks;
            for (let deck of decksWithDetailedFlashcards) {
                deck.isFavorite = usersFavorites.includes(deck._id);
            }

        res.status(StatusCodes.OK).json({
            decks: decksWithDetailedFlashcards,
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

        const detailedFlashcards = await getDetailedFlashcards(deck.flashcards);

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