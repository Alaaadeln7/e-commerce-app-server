/**
 * @swagger
 * components:
 *   schemas:
 *     Discount:
 *       type: object
 *       required:
 *         - code
 *         - discountPercentage
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the discount
 *         code:
 *           type: string
 *           description: The discount code
 *         discountPercentage:
 *           type: number
 *           format: float
 *           description: The percentage of the discount
 *         expiryDate:
 *           type: string
 *           format: date
 *           description: The expiry date of the discount code
 */

/**
 * @swagger
 * /discounts:
 *   get:
 *     summary: Get all discount codes
 *     security:
 *       - bearerAuth: []
 *     tags: [Discounts]
 *     responses:
 *       200:
 *         description: A list of discount codes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Discount'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *
 *   post:
 *     summary: Create a new discount code
 *     security:
 *       - bearerAuth: []
 *     tags: [Discounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Discount'
 *     responses:
 *       201:
 *         description: Discount created successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *
 * /discounts/validate:
 *   post:
 *     summary: Validate a discount code
 *     security:
 *       - bearerAuth: []
 *     tags: [Discounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Discount code is valid
 *       400:
 *         description: Invalid discount code
 *       401:
 *         description: Not authorized
 *
 * /discounts/use:
 *   post:
 *     summary: Use a discount code
 *     security:
 *       - bearerAuth: []
 *     tags: [Discounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Discount code applied successfully
 *       400:
 *         description: Invalid or expired discount code
 *       401:
 *         description: Not authorized
 *
 * /discounts/{discountId}:
 *   delete:
 *     summary: Delete a discount code
 *     security:
 *       - bearerAuth: []
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: discountId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the discount to delete
 *     responses:
 *       200:
 *         description: Discount deleted successfully
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Discount not found
 */
