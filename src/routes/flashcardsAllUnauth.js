const express = require('express');
const router = express.Router();

const { getAllFlashcards } = require('../controllers/Flashcards');

router.route('/').get(getAllFlashcards);

module.exports = router;