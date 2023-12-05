const express = require('express');
const router = express.Router();

const {
    getUserDecks,
    createDeck,
    updateDeck,
    deleteDeck,
    getDeckWithFlashcards,
} = require('../controllers/Decks');

router.route('/').post(createDeck).get(getUserDecks);
router.route('/:id').get(getDeckWithFlashcards).delete(deleteDeck).patch(updateDeck);

module.exports = router;