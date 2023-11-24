const express = require('express');
const router = express.Router();

const { login, register, getById, logout } = require('../controllers/User');

router.post('/register', register);
router.post('/login', login);
router.get('/:id', getById);
router.post('/logout', logout);

module.exports = router;