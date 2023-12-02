const express = require('express');
const router = express.Router();

const {
    getUserFlashcards,
    getFlashcard,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getFlashcardsForDeck,
    getDeckWithFlashcards,
} = require('../controllers/Flashcards');

router.route('/').post(createFlashcard).get(getUserFlashcards);
router.route('/:id').get([getFlashcard, getDeckWithFlashcards]).delete(deleteFlashcard).patch(updateFlashcard);
router.route('/:id/flashcards').get(getFlashcardsForDeck);

module.exports = router;