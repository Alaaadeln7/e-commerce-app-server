/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - userId
 *         - productId
 *         - rating
 *         - comment
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the review
 *         userId:
 *           type: string
 *           description: The ID of the user who wrote the review
 *         productId:
 *           type: string
 *           description: The ID of the product being reviewed
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: The rating given to the product (1-5 stars)
 *         comment:
 *           type: string
 *           description: The review comment text
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the review was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the review was last updated
 */

/**
 * @swagger
 * /reviews/addReview:
 *   post:
 *     summary: Add a new review for a product
 *     security:
 *       - bearerAuth: []
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - rating
 *               - comment
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to review
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 description: The rating to give the product (1-5 stars)
 *               comment:
 *                 type: string
 *                 description: The review comment text
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Invalid review data
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Product not found
 * 
 * /reviews/{productId}:
 *   get:
 *     summary: Get all reviews for a specific product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the product to get reviews for
 *     responses:
 *       200:
 *         description: List of reviews for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: Product not found
 */
