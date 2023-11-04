const express = require('express');
const router = express.Router();

const {
    getUserFlashcards,
    getFlashcard,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard
} = require('../controllers/Flashcards');

router.route('/').post(createFlashcard).get(getUserFlashcards);
router.route('/:id').get(getFlashcard).delete(deleteFlashcard).patch(updateFlashcard);

module.exports = router;