const express = require('express');
const router = express.Router();

const { getAllFlashcards } = require('../controllers/Flashcards');

/**
 * @swagger
 * /api/v1/flashcardsAll:
 *   get:
 *     summary: Get all flashcards for unauthenticated users
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
 *         description: List of flashcards for unauthenticated users
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
 */

router.route('/').get(getAllFlashcards);

module.exports = router;