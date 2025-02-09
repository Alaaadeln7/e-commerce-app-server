/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for a product
 *         title:
 *           type: string
 *           description: The name of the product
 *         price:
 *           type: number
 *           format: float
 *           description: The price of the product
 *         description:
 *           type: string
 *           description: A description of the product
 *         category:
 *           type: string
 *           description: The category of the product
 *         stock:
 *           type: integer
 *           description: The amount of stock available for the product
 *         thumbnail:
 *           type: string
 *           description: The URL of the product thumbnail
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of URLs for additional product images
 */

/**
 * @swagger
 * /api/products/:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/products/{productId}:
 *   get:
 *     summary: Get single product
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to retrieve
 *     responses:
 *       200:
 *         description: get a single product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   products:
 *                     $ref: '#/components/schemas/Product'
 */

/**
 * @swagger
 * /api/products/create:
 *   post:
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     description: Create a new product (Seller only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized - Not logged in or not a seller
 *       400:
 *         description: Invalid product data
 */

/**
 * @swagger
 * /api/products/update/{productId}:
 *   put:
 *     summary: Update a product
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     description: Update an existing product (Seller only)
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized - Not logged in or not a seller
 *       404:
 *         description: Product not found
 */

/**
 * @swagger
 * /api/products/delete/{productId}:
 *   delete:
 *     summary: Delete a product
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Products
 *     description: Delete a product (Seller only)
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized - Not logged in or not a seller
 *       404:
 *         description: Product not found
 */