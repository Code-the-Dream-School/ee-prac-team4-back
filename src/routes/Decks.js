const express = require('express');
const router = express.Router();

const {
    getUserDecks,
    getDeck,
    getDeckByDeckId,
    createDeck,
    updateDeck,
    deleteDeck
} = require('../controllers/Decks');

router.route('/').post(createDeck).get(getUserDecks);
router.route('/:id').get(getDeck).delete(deleteDeck).patch(updateDeck);

module.exports = router;