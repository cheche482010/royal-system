import express from "express"
import {
  getAllCarritoItems,
  getCarritoByUsuario,
  addToCarrito,
  updateCarritoItem,
  removeFromCarrito,
  clearCarrito,
} from "../controllers/CarritoController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /carrito:
 *   get:
 *     summary: Get all carrito items
 *     description: Retrieve a list of all carrito items
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carrito
 *     responses:
 *       200:
 *         description: A list of carrito items
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllCarritoItems)

/**
 * @swagger
 * /carrito/usuario/{usuario_id}:
 *   get:
 *     summary: Get carrito items by usuario
 *     description: Retrieve carrito items for a specific usuario
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carrito
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrito items for the usuario
 *       404:
 *         description: Usuario not found
 *       401:
 *         description: Unauthorized
 */
router.get("/usuario/:usuario_id", protect, getCarritoByUsuario)

/**
 * @swagger
 * /carrito:
 *   post:
 *     summary: Add item to carrito
 *     description: Add a product to the carrito
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carrito
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
 *         description: Item added to carrito successfully
 *       400:
 *         description: Invalid input or insufficient stock
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, addToCarrito)

/**
 * @swagger
 * /carrito/{id}:
 *   put:
 *     summary: Update carrito item
 *     description: Update the quantity of a carrito item
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carrito
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
 *         description: Carrito item updated successfully
 *       400:
 *         description: Invalid input or insufficient stock
 *       404:
 *         description: Carrito item not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updateCarritoItem)

/**
 * @swagger
 * /carrito/{id}:
 *   delete:
 *     summary: Remove item from carrito
 *     description: Remove an item from the carrito
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carrito
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed from carrito successfully
 *       404:
 *         description: Carrito item not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, removeFromCarrito)

/**
 * @swagger
 * /carrito/clear/{usuario_id}:
 *   delete:
 *     summary: Clear carrito
 *     description: Remove all items from a usuario's carrito
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carrito
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrito cleared successfully
 *       404:
 *         description: Usuario not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/clear/:usuario_id", protect, clearCarrito)

export default router