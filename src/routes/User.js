const express = require('express');
const router = express.Router();

const { login, register, getById, getFavoriteDecks, logout } = require('../controllers/User');

router.get('/:id/favorite', getFavoriteDecks);
router.get('/:id', getById);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;