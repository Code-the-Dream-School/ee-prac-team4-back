const express = require('express');
const router = express.Router();

const { login, register, getById, logout } = require('../controllers/User');

/**
 * @swagger
 * components:
 *      schemas:
 *          User:
 *              type: object
 *              required:
 *                  -username
 *                  -firstName
 *                  -lastName
 *                  -role
 *                  -email
 *                  -password
 *              properties:
 *                  username:
 *                      type: string
 *                      description: username
 *                  firstName:
 *                      type: string
 *                      description: first name of the user
 *                  lastName:
 *                      type: string
 *                      description: last name of the user
 *                  role:
 *                      type: string
 *                      description: the user should choose from available options of Mentor, Student, or Apprentice
 *                  email:
 *                      type: string
 *                      description: user's email
 *                  password:
 *                      type: string
 *                      description: password
 *              example:
 *                  username: johnDoe
 *                  firstName: John
 *                  lastName: Doe
 *                  role: Student
 *                  email: johndoe@gmail.com
 *                  password: SecretPassword#!
 * 
 */

router.get('/user/:id', getById);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;