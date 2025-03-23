import express from "express"
import {
  getAllOrdenes,
  getOrdenById,
  getOrdenesByUsuario,
  createOrden,
  updateOrdenStatus,
  cancelOrden,
} from "../controllers/OrdenController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /ordenes:
 *   get:
 *     summary: Get all ordenes
 *     description: Retrieve a list of all ordenes
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Ordenes
 *     responses:
 *       200:
 *         description: A list of ordenes
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllOrdenes)

/**
 * @swagger
 * /ordenes/{id}:
 *   get:
 *     summary: Get an orden by ID
 *     description: Retrieve a single orden by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Ordenes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orden details
 *       404:
 *         description: Orden not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getOrdenById)

/**
 * @swagger
 * /ordenes/usuario/{usuario_id}:
 *   get:
 *     summary: Get ordenes by usuario
 *     description: Retrieve all ordenes for a specific usuario
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Ordenes
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of ordenes for the usuario
 *       404:
 *         description: Usuario not found
 *       401:
 *         description: Unauthorized
 */
router.get("/usuario/:usuario_id", protect, getOrdenesByUsuario)

/**
 * @swagger
 * /ordenes:
 *   post:
 *     summary: Create a new orden
 *     description: Create a new orden from the usuario's carrito
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Ordenes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Orden created successfully
 *       400:
 *         description: Invalid input or empty carrito
 *       404:
 *         description: Usuario not found
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createOrden)

/**
 * @swagger
 * /ordenes/{id}/status:
 *   put:
 *     summary: Update orden status
 *     description: Update the status of an orden
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Ordenes
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
 *               status:
 *                 type: string
 *                 enum: [Pendiente, Completa, Cancelada]
 *     responses:
 *       200:
 *         description: Orden status updated successfully
 *       404:
 *         description: Orden not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id/status", protect, updateOrdenStatus)

/**
 * @swagger
 * /ordenes/{id}/cancel:
 *   put:
 *     summary: Cancel an orden
 *     description: Cancel an orden by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Ordenes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Orden cancelled successfully
 *       404:
 *         description: Orden not found
 *       400:
 *         description: Orden cannot be cancelled
 *       401:
 *         description: Unauthorized
 */
router.put("/:id/cancel", protect, cancelOrden)

export default router