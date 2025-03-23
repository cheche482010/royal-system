import express from "express"
import {
  getAllHistorialPrecios,
  getHistorialByProducto,
  createHistorialPrecio,
  deleteHistorialPrecio,
} from "../controllers/HistorialPrecioController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /historial-precios:
 *   get:
 *     summary: Get all price history
 *     description: Retrieve a list of all price history records
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Historial Precios
 *     responses:
 *       200:
 *         description: A list of price history records
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllHistorialPrecios)

/**
 * @swagger
 * /historial-precios/producto/{producto_id}:
 *   get:
 *     summary: Get price history by producto
 *     description: Retrieve price history for a specific producto
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Historial Precios
 *     parameters:
 *       - in: path
 *         name: producto_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Price history for the producto
 *       404:
 *         description: Producto not found
 *       401:
 *         description: Unauthorized
 */
router.get("/producto/:producto_id", protect, getHistorialByProducto)

/**
 * @swagger
 * /historial-precios:
 *   post:
 *     summary: Create a new price history record
 *     description: Create a new price history record and update producto prices
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Historial Precios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               producto_id:
 *                 type: integer
 *               precio_unidad:
 *                 type: number
 *                 format: float
 *               precio_tienda:
 *                 type: number
 *                 format: float
 *               precio_distribuidor:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Price history record created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Producto not found
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createHistorialPrecio)

/**
 * @swagger
 * /historial-precios/{id}:
 *   delete:
 *     summary: Delete a price history record
 *     description: Soft delete a price history record by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Historial Precios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Price history record deleted successfully
 *       404:
 *         description: Price history record not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteHistorialPrecio)

export default router