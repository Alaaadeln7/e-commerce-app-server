/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - orderId
 *         - amount
 *         - paymentMethod
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the payment
 *         orderId:
 *           type: string
 *           description: The ID of the order being paid for
 *         amount:
 *           type: number
 *           format: float
 *           description: The amount paid for the order
 *         paymentMethod:
 *           type: string
 *           description: The method used for payment (e.g., "credit card", "PayPal")
 *         status:
 *           type: string
 *           description: The status of the payment (e.g., "completed", "pending")
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the payment was made
 * 
 *     CheckoutSession:
 *       type: object
 *       required:
 *         - orderId
 *       properties:
 *         orderId:
 *           type: string
 *           description: The ID of the order to checkout
 *         sessionId:
 *           type: string
 *           description: The Stripe checkout session ID
 *         url:
 *           type: string
 *           description: The URL to redirect the user to for payment
 *         status:
 *           type: string
 *           enum: [pending, completed, failed]
 *           description: The status of the checkout session
 * 
 *     PaymentSuccess:
 *       type: object
 *       properties:
 *         sessionId:
 *           type: string
 *           description: The Stripe session ID from the successful payment
 *         orderId:
 *           type: string
 *           description: The ID of the order that was paid for
 *         paymentStatus:
 *           type: string
 *           enum: [succeeded, failed]
 *           description: The status of the payment
 *         paymentIntent:
 *           type: string
 *           description: The Stripe payment intent ID
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Process a payment for an order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment processed successfully
 *       400:
 *         description: Invalid payment details
 * 
 * /payments/{orderId}:
 *   get:
 *     summary: Get the payment details for a specific order
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment details for the specified order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 * 
 * /payments/create-checkout-session:
 *   post:
 *     summary: Create a new Stripe checkout session for an order
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The ID of the order to create a checkout session for
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutSession'
 *       400:
 *         description: Invalid order ID or order already paid
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error creating checkout session
 * 
 * /payments/payment-success:
 *   post:
 *     summary: Handle successful payment webhook from Stripe
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sessionId
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: The Stripe checkout session ID
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentSuccess'
 *       400:
 *         description: Invalid session ID or payment already processed
 *       404:
 *         description: Session not found
 *       500:
 *         description: Error processing payment
 */
