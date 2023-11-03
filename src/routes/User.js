const express = require('express');
const router = express.Router();

const { login, register, getById } = require('../controllers/User');

router.get('/user/:id', getById);
router.post('/register', register);
router.post('/login', login);

module.exports = router;