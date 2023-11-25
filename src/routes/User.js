const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authentication');
const { login, register, getById, logout } = require('../controllers/User');

router.get('/user/:id',authenticateUser, getById);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;