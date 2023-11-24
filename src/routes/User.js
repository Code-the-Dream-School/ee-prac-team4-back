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
 *                      description: choose from available options of Mentor, Student, or Apprentice
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

/**
 * @swagger
 * tags:
 *      name: Users
 *      description: The Users managing API
 */

// router.post('/register', register);

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *      summary: Register a new user
 *      tags: [Users]
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '../src/models/User'
 *      responses:
 *          200: 
 *              description: The user was successfully created
 *              content: 
 *                    application/json:
 *                          schema:
 *                              $ref: './src/models/User'
 *          500:
 *              description: Some server error
 */

/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *      summary: User login
 *      tags: [Users]
 *      requestBody: 
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties: 
 *                         email:
 *                            type: string
 *                            description: User's email
 *                         password:
 *                            type: string
 *                            description: User's password
 *      responses:
 *          200: 
 *              description: The user successfully logged in
 *              content: 
 *                    application/json:
 *                          schema:
 *                              $ref: './src/models/User'
 *                          token:
 *                              type: string
 *                              description: JWT token for authentication
 *          401:
 *              description: Invalid email or password
 *          500:
 *              description: Some server error
 *              content:
 *                  aplication/json:
 *                      example:
 *                          error: Internal server error
 */

/**
 * @swagger
 * /api/v1/user/{id}:
 *      get:
 *          summary: Returns a single user by id
 *          tags: [Users]
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                description: ID of the user
 *                schema:
 *                   type: string
 *          responses:
 *              200: 
 *                  description: A registered user
 *                  content: 
 *                      application/json:
 *                          schema:
 *                              $ref: './src/models/User'
 */

/**
 * @swagger
 * /api/v1/user/logout:
 *  post:
 *      summary: Loggs out the user
 *      tags: [Users]
 *      responses:
 *           200: 
 *              description: Successfully logged out
 *           500:
 *              description: Some server error
 *              content:
 *                  application/json:
 *                      example:
 *                          error: Internal server error
 */
router.post('/register', register);
router.post('/login', login);
router.get('/:id', getById);
router.post('/logout', logout);

module.exports = router;