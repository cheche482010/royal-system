// routes/CarritoRoutes.js
import express from "express"
import {
  getAllCarritos,
  getCarritoById,
  createCarrito,
  updateCarrito,
  deleteCarrito,
} from "../controllers/CarritoController.js"
import { protect } from "../middleware/auth.js"
const router = express.Router()

/**
 * @swagger
 * /carritos:
 *   get:
 *     summary: Get all carritos
 *     description: Retrieve a list of all carrito entries
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carritos
 *     responses:
 *       200:
 *         description: List of carritos
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllCarritos)

/**
 * @swagger
 * /carritos/{id}:
 *   get:
 *     summary: Get a carrito by ID
 *     description: Retrieve a specific carrito entry
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carritos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrito found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Carrito not found
 */
router.get("/:id", protect, getCarritoById)

/**
 * @swagger
 * /carritos:
 *   post:
 *     summary: Create a new carrito entry
 *     description: Create a new carrito record
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carritos
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
 *         description: Carrito created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createCarrito)

/**
 * @swagger
 * /carritos/{id}:
 *   put:
 *     summary: Update a carrito entry
 *     description: Update an existing carrito record
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carritos
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
 *         description: Carrito updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Carrito not found
 */
router.put("/:id", protect, updateCarrito)

/**
 * @swagger
 * /carritos/{id}:
 *   delete:
 *     summary: Delete a carrito entry
 *     description: Soft delete a carrito record
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Carritos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carrito deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Carrito not found
 */
router.delete("/:id", protect, deleteCarrito)

export default router