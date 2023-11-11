const Flashcard = require('../models/Flashcard');
const Deck = require('../models/Deck');
const { StatusCodes } = require('http-status-codes');

// get all decks by unauthenticated users
const getAllDecks = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const offset = (page -1) * limit;
        const totalDecks = await Deck.countDocuments({});
        const decks = await Deck.find({})
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
        const offset = (page -1) * limit;
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

// get one deck for an auth user
const getDeck = async (req, res) => {
    const {
        user: { userId },
        params: { id: deckId }
    } = req;

    try {
        const deck = await Deck.findOne({
            _id: deckId, createdBy: userId
        });

        if (!deck) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: `No deck with id ${deckId}` })
        }

        res.status(StatusCodes.OK).json({ deck });

    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal server error'});
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
        body: { title, isPublic, createdBy, flashcards },
        user: { userId },
        params: { id: deckId }
    } = req;

    const updatedFields = {};

    if (title !== undefined) {
        updatedFields.title = title;
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
    getDeck,
    createDeck,
    updateDeck,
    deleteDeck
}