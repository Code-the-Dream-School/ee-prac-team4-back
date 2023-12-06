const express = require('express');
const router = express.Router();
const {requiresAuth, addUserFromAuth} = require('../middleware/authentication')

const {
    getUserFlashcards,
    getFlashcard,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    getDeckWithFlashcards,
} = require('../controllers/Flashcards');

// Read Operations
router.use(addUserFromAuth).route('/').get(getUserFlashcards);
router.use(addUserFromAuth).route('/:id').get(getFlashcard);

// Write Operations
router.use(requiresAuth).route('/').post(createFlashcard);
router.use(requiresAuth).route('/:id').delete(deleteFlashcard).patch(updateFlashcard);

module.exports = router;