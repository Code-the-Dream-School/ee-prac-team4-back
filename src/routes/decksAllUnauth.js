const express = require('express');
const router = express.Router();

const { getAllDecks } = require('../controllers/Decks');

router.route('/').get(getAllDecks);

module.exports = router;