const express = require('express');
const router = express.Router();

const {
    getUserFlashcards,
    getFlashcard,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard
} = require('../controllers/Flashcards');

/**
 * @swagger
 * components:
 *   schemas:
 *     Flashcard:
 *       type: object
 *       required:
 *         - question
 *         - answer
 *         - createdBy
 *       properties:
 *         question:
 *           type: string
 *           description: The question for the flashcard
 *         answer:
 *           type: string
 *           description: The answer for the flashcard
 *         resources:
 *           type: string
 *           description: Additional resources related to the flashcard
 *         hint:
 *           type: string
 *           description: A hint for the flashcard
 *         createdBy:
 *           type: string
 *           description: ID of the user who created the flashcard
 *       example:
 *         question: "What is the capital of France?"
 *         answer: "Paris"
 *         resources: "https://en.wikipedia.org/wiki/Paris"
 *         hint: "Think about famous landmarks."
 *         createdBy: "user123"
 *
 * /api/v1/flashcard:
 *   post:
 *     summary: Create a new flashcard
 *     tags: [Flashcards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Flashcard'
 *     responses:
 *       201:
 *         description: Flashcard created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flashcard'
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Get flashcards for the logged-in user
 *     tags: [Flashcards]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of flashcards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flashcards:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Flashcard'
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *       500:
 *         description: Internal server error
 *
 * /api/v1/flashcard/{id}:
 *   get:
 *     summary: Get a specific flashcard
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the flashcard
 *     responses:
 *       200:
 *         description: Flashcard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flashcard'
 *       404:
 *         description: Flashcard not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a specific flashcard
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the flashcard
 *     responses:
 *       200:
 *         description: Flashcard deleted successfully
 *       400:
 *         description: Flashcard not found
 *       500:
 *         description: Internal server error
 *
 *   patch:
 *     summary: Update a specific flashcard
 *     tags: [Flashcards]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the flashcard
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *                 description: The updated question
 *               answer:
 *                 type: string
 *                 description: The updated answer
 *               resources:
 *                 type: string
 *                 description: The updated resources
 *               hint:
 *                 type: string
 *                 description: The updated hint
 *     responses:
 *       200:
 *         description: Flashcard updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flashcard'
 *       400:
 *         description: No fields to update
 *       500:
 *         description: Internal server error
 */

router.route('/').post(createFlashcard).get(getUserFlashcards);
router.route('/:id').get(getFlashcard).delete(deleteFlashcard).patch(updateFlashcard);

module.exports = router;