const express = require('express');
const router = express.Router();

const { login, register, getUserById } = require('../controllers/User');

router.get('/user/:id', getUserById);
router.post('/register', register);
router.post('/login', login);

module.exports = router;