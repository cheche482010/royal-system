import express from "express"
import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  hardDeleteProducto,
} from "../controllers/productoController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Get all productos
 *     description: Retrieve a list of all active productos
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: A list of productos
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllProductos)

/**
 * @swagger
 * /api/productos/{id}:
 *   get:
 *     summary: Get a producto by ID
 *     description: Retrieve a single producto by its ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto details
 *       404:
 *         description: Producto not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getProductoById)

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Create a new producto
 *     description: Create a new producto record
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               presentacion:
 *                 type: string
 *               cantidad:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto created successfully
 *       400:
 *         description: Invalid input or producto already exists
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createProducto)

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Update a producto
 *     description: Update producto details
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               presentacion:
 *                 type: string
 *               cantidad:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Producto updated successfully
 *       404:
 *         description: Producto not found
 *       400:
 *         description: Invalid input or duplicate values
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updateProducto)

/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Delete a producto
 *     description: Soft delete a producto by ID (sets is_delete to true)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto deleted successfully
 *       404:
 *         description: Producto not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteProducto)

/**
 * @swagger
 * /api/productos/{id}/hard:
 *   delete:
 *     summary: Permanently delete a producto
 *     description: Hard delete a producto by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto permanently deleted
 *       404:
 *         description: Producto not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete("/:id/hard", protect, hardDeleteProducto)

export default router

