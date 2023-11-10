const Flashcard = require('../models/Flashcard');
const { StatusCodes } = require('http-status-codes');

// GET all flashcards for any unauthenticated user
const getAllFlashcards = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const offset = (page - 1) * limit;
        const totalFlashcards = await Flashcard.countDocuments({});
        const flashcards = await Flashcard.find({})
            .sort('createdAt')
            .skip(offset)
            .limit(limit);

            res.status(StatusCodes.OK).json({ 
                flashcards, 
                currentPage: page,
                totalPages: Math.ceil(totalFlashcards / limit),
                totalItems: totalFlashcards, 
            });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal server error' })
    }
};

// GET the flashcards of a specific user (for a logged in user)
const getUserFlashcards = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const offset = (page - 1) * limit;
        const totalFlashcards = await Flashcard.countDocuments({ createdBy: req.user.userId });
        const flashcards = await Flashcard.find({ createdBy: req.user.userId })
            .sort('createdAt')
            .skip(offset)
            .limit(limit);

            res.status(StatusCodes.OK).json({ 
                flashcards, 
                currentPage: page,
                totalPages: Math.ceil(totalFlashcards / limit),
                totalItems: totalFlashcards, 
            });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Internal server error' })
    }
};

// get the flashcards that appertain to a specific deck
const getFlashcardForDeck = async (req, res) => {

    req.body.createdBy = req.user.userId;
    const flashcards = await Flashcard.find({ createdBy: req.user.userId, deck: req.id }).sort('createdAt');
    res.status(StatusCodes.CREATED).json({ flashcards, count: flashcards.length });
};

// get one flashcard
const getFlashcard = async (req, res) => {
    const { 
        user: { userId }, 
        params: { id: flashcardId } 
    } = req;

    try {
        const flashcard = await Flashcard.findOne({
            _id: flashcardId, createdBy: userId
        });
    
        if (!flashcard) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: `No flashcard with id ${flashcardId}` });
        }
    
        res.status(StatusCodes.OK).json({ flashcard });
        
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error" });
    }
    
};

// create flashcard according to the schema
const createFlashcard = async (req, res) => {

    req.body.createdBy = req.user.userId;
    const flashcard = await Flashcard.create(req.body);
    res.status(StatusCodes.CREATED).json({ flashcard });
};

// update flashcard
const updateFlashcard = async (req, res) => {
    const {
        body: { topic, question, answer, resources, hint, createdBy },
        user: { userId },
        params: { id: flashcardId }
    } = req;

    const updatedFields = {};

    if (topic != undefined) {
        updatedFields.topic = topic;
    }

    if (question != undefined) {
        updatedFields.question = question;
    }

    if (answer != undefined) {
        updatedFields.answer = answer;
    }

    if (resources != undefined) {
        updatedFields.resources = resources;
    }

    if (hint != undefined) {
        updatedFields.hint = hint;
    }

    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ msg: 'No fields to update' });
    }

    const flashcard = await Flashcard.findByIdAndUpdate(
        { _id: flashcardId, createdBy: userId },
        { $set: updatedFields },
        { new: true, runValidators: true }
    )

    if (!flashcard) {
        return res.status(400).json({ msg: `No flashcard with id ${flashcardId}` });
    }

    res.status(StatusCodes.OK).json({ flashcard });
}

// delete flashcard
const deleteFlashcard = async (req, res) => {
    const {
        user: { userId },
        params: { id: flashcardId }
    } = req;

    const flashcard = await Flashcard.findOneAndDelete(
        { _id: flashcardId, createdBy: userId }
    );

    if(!flashcard) {
        return res.status(400).json({ msg: `No flashcard with id ${flashcardId}` });
    }

    res.status(StatusCodes.OK).json({ msg: "Flashcard deleted" })
};

module.exports = {
    getAllFlashcards,
    getUserFlashcards,
    getFlashcardForDeck,
    getFlashcard,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
}