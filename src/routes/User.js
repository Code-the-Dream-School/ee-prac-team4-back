const express = require('express');
const router = express.Router();
const auth = require('../middleware/authentication')

const { login, register, getById, logout } = require('../controllers/User');

router.get('/user/:id', getById);
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;