import express from "express"
import {
  getAllCarritoProductos,
  getCarritoProductoById,
  getCarritoProductosByCarritoId,
  addProductToCarrito,
  updateCarritoProducto,
  removeProductFromCarrito,
  clearCarritoProductos,
} from "../controllers/CarritoProductoController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /cart-products:
 *   get:
 *     summary: Get all cart products
 *     description: Retrieve a list of all cart products
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cart Products
 *     responses:
 *       200:
 *         description: A list of cart products
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllCarritoProductos)

/**
 * @swagger
 * /cart-products/{id}:
 *   get:
 *     summary: Get cart product by ID
 *     description: Retrieve a specific cart product by its ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cart Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart product details
 *       404:
 *         description: Cart product not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getCarritoProductoById)

/**
 * @swagger
 * /cart-products/carrito/{carrito_id}:
 *   get:
 *     summary: Get cart products by carrito ID
 *     description: Retrieve all products in a specific cart
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cart Products
 *     parameters:
 *       - in: path
 *         name: carrito_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of products in the cart
 *       401:
 *         description: Unauthorized
 */
router.get("/carrito/:carrito_id", protect, getCarritoProductosByCarritoId)

/**
 * @swagger
 * /cart-products:
 *   post:
 *     summary: Add product to cart
 *     description: Add a product to a specific cart
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cart Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               carrito_id:
 *                 type: integer
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *       400:
 *         description: Invalid input or insufficient stock
 *       404:
 *         description: Cart or product not found
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, addProductToCarrito)

/**
 * @swagger
 * /cart-products/{id}:
 *   put:
 *     summary: Update cart product
 *     description: Update the quantity of a product in the cart
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cart Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart product updated successfully
 *       400:
 *         description: Invalid input or insufficient stock
 *       404:
 *         description: Cart product not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updateCarritoProducto)

/**
 * @swagger
 * /cart-products/{id}:
 *   delete:
 *     summary: Remove product from cart
 *     description: Remove a product from the cart
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cart Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *       404:
 *         description: Cart product not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, removeProductFromCarrito)

/**
 * @swagger
 * /cart-products/clear/{carrito_id}:
 *   delete:
 *     summary: Clear cart products
 *     description: Remove all products from a specific cart
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cart Products
 *     parameters:
 *       - in: path
 *         name: carrito_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart products cleared successfully
 *       404:
 *         description: Cart not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/clear/:carrito_id", protect, clearCarritoProductos)

export default router

