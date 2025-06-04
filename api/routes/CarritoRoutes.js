import express from "express"
import {
  getAllCartItems,
  getCartByUsuario,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/CarritoController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /cart/getAllCart:
 *   get:
 *     summary: Get all cart items
 *     description: Retrieve a list of all cart items
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cart
 *     responses:
 *       200:
 *         description: A list of cart items
 *       401:
 *         description: Unauthorized
 */
router.get("/getAllCart", protect, getAllCartItems) 

/**
 * @swagger
 * /cart/usuario/{usuario_id}:
 *   get:
 *     summary: Get cart items by usuario
 *     description: Retrieve cart items for a specific usuario
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart items for the usuario
 *       404:
 *         description: Usuario not found
 *       401:
 *         description: Unauthorized
 */
router.get("/usuario/:usuario_id", protect, getCartByUsuario)

/**
 * @swagger
 * /cart/addToCart:
 *   post:
 *     summary: Add item to cart
 *     description: Add a product to the cart
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item added to cart successfully
 *       400:
 *         description: Invalid input or insufficient stock
 *       401:
 *         description: Unauthorized
 */
router.post("/addToCart", protect, addToCart)

/**
 * @swagger
 * /cart/update/{id}:
 *   put:
 *     summary: Update cart item
 *     description: Update the quantity of a cart item
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cart
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
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid input or insufficient stock
 *       404:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized
 */
router.put("/update/:id", protect, updateCartItem)

/**
 * @swagger
 * /cart/removeFromCart/{id}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Remove an item from the cart
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       404:
 *         description: Cart item not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/removeFromCart/:id", protect, removeFromCart)

/**
 * @swagger
 * /cart/clearCart/{usuario_id}:
 *   delete:
 *     summary: Clear cart
 *     description: Remove all items from a usuario's cart
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       404:
 *         description: Usuario not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/clearCart/:usuario_id", protect, clearCart)

export default router