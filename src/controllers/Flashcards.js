const Flashcard = require('../models/Flashcard');
const { StatusCodes } = require('http-status-codes');

const getAllFlashcards = async (req, res) => {
    const flashcards = await Flashcard.find({}).sort('createdAt');
    res.status(StatusCodes.OK).json({ flashcards, count: flashcards.length });
};

const getUserFlashcards = async (req, res) => {
    const flashcards = await Flashcard.find({ createdBy: req.user.userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ flashcards, count: flashcards.length });
};

const getFlashcard = async (req, res) => {
    const { 
        user: { userId }, 
        params: { id: flashcardId } 
    } = req;

    console.log("User ID:", userId);
    console.log("Flashcard ID:", flashcardId);

    try {
        const flashcard = await Flashcard.findOne({
            _id: flashcardId, createdBy: userId
        });
    
        if (!flashcard) {
            console.log(`No flashcard with id ${flashcardId}`);
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "Flashcard not found" });
        }
    
        console.log('Flashcard 11111', flashcard);
        res.status(StatusCodes.OK).json({ flashcard });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Internal server error" });
    }
    
};

const createFlashcard = async (req, res) => {
    console.log('Request body:', req.body);
    console.log('User Object:', req.user);

    req.body.createdBy = req.user.userId;
    const flashcard = await Flashcard.create(req.body);
    res.status(StatusCodes.CREATED).json({ flashcard });
};

const updateFlashcard = async (req, res) => {
    const {
        body: { title, author, question, answer, createdBy },
        user: { userId },
        params: { id: flashcardId }
    } = req;

    if (title === '' || author === '' || question === '' || answer === '' || createdBy === '') {
        console.log('Fields cannot be empty!');
    }

    const flashcard = await Flashcard.findByIdAndUpdate(
        { _id: flashcardId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    )

    if (!flashcard) {
        console.log(`No flashcard with id ${flashcardId}`);
    }

    res.status(StatusCodes.OK).json({ flashcard });
}

const deleteFlashcard = async (req, res) => {
    const {
        user: { userId },
        params: { id: flashcardId }
    } = req;

    const flashcard = await Flashcard.findOneAndDelete(
        { _id: flashcardId, createdBy: userId }
    );

    if(!flashcard) {
        console.log(`No flashcard with id ${flashcardId}`);
    }

    res.status(StatusCodes.OK).json({ msg: "Flashcard deleted" })
};

module.exports = {
    getAllFlashcards,
    getUserFlashcards,
    getFlashcard,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard
}