import express from "express"
import {
  getAllDetallesOrden,
  getDetalleOrdenById,
  getDetallesByOrden,
  createDetalleOrden,
  updateDetalleOrden,
  deleteDetalleOrden,
} from "../controllers/DetalleOrdenController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /detalles-orden:
 *   get:
 *     summary: Get all detalles de orden
 *     description: Retrieve a list of all detalles de orden
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Detalles Orden
 *     responses:
 *       200:
 *         description: A list of detalles de orden
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllDetallesOrden)

/**
 * @swagger
 * /detalles-orden/{id}:
 *   get:
 *     summary: Get a detalle de orden by ID
 *     description: Retrieve a single detalle de orden by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Detalles Orden
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de orden details
 *       404:
 *         description: Detalle de orden not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getDetalleOrdenById)

/**
 * @swagger
 * /detalles-orden/orden/{orden_id}:
 *   get:
 *     summary: Get detalles by orden
 *     description: Retrieve all detalles for a specific orden
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Detalles Orden
 *     parameters:
 *       - in: path
 *         name: orden_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of detalles for the orden
 *       404:
 *         description: Orden not found
 *       401:
 *         description: Unauthorized
 */
router.get("/orden/:orden_id", protect, getDetallesByOrden)

/**
 * @swagger
 * /detalles-orden:
 *   post:
 *     summary: Create a new detalle de orden
 *     description: Create a new detalle de orden
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Detalles Orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orden_id:
 *                 type: integer
 *               producto_id:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precio:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Detalle de orden created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Orden or producto not found
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createDetalleOrden)

/**
 * @swagger
 * /detalles-orden/{id}:
 *   put:
 *     summary: Update a detalle de orden
 *     description: Update a detalle de orden by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Detalles Orden
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
 *               cantidad:
 *                 type: integer
 *               precio:
 *                 type: number
 *                 format: float
 *     responses:
 *       200:
 *         description: Detalle de orden updated successfully
 *       404:
 *         description: Detalle de orden not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updateDetalleOrden)

/**
 * @swagger
 * /detalles-orden/{id}:
 *   delete:
 *     summary: Delete a detalle de orden
 *     description: Delete a detalle de orden by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Detalles Orden
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de orden deleted successfully
 *       404:
 *         description: Detalle de orden not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteDetalleOrden)

export default router