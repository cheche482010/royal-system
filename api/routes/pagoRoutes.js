import express from "express"
import {
  getAllPagos,
  getPagoById,
  getPagosByUsuarioId,
  createPago,
  updatePago,
  deletePago,
  hardDeletePago,
} from "../controllers/pagoController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /api/pagos:
 *   get:
 *     summary: Get all pagos
 *     description: Retrieve a list of all active pagos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of pagos
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllPagos)

/**
 * @swagger
 * /api/pagos/{id}:
 *   get:
 *     summary: Get a pago by ID
 *     description: Retrieve a single pago by its ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago details
 *       404:
 *         description: Pago not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getPagoById)

/**
 * @swagger
 * /api/pagos/usuario/{usuario_id}:
 *   get:
 *     summary: Get pagos by usuario ID
 *     description: Retrieve all pagos for a specific usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of pagos for the usuario
 *       401:
 *         description: Unauthorized
 */
router.get("/usuario/:usuario_id", protect, getPagosByUsuarioId)

/**
 * @swagger
 * /api/pagos:
 *   post:
 *     summary: Create a new pago
 *     description: Create a new pago record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               precio_usuario_id:
 *                 type: integer
 *               producto_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               referencia:
 *                 type: string
 *               numero_referencia:
 *                 type: string
 *               monto:
 *                 type: number
 *                 format: decimal
 *     responses:
 *       201:
 *         description: Pago created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Precio-Usuario relationship or Producto not found
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createPago)

/**
 * @swagger
 * /api/pagos/{id}:
 *   put:
 *     summary: Update a pago
 *     description: Update pago details
 *     security:
 *       - bearerAuth: []
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
 *               precio_usuario_id:
 *                 type: integer
 *               producto_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               referencia:
 *                 type: string
 *               numero_referencia:
 *                 type: string
 *               monto:
 *                 type: number
 *                 format: decimal
 *     responses:
 *       200:
 *         description: Pago updated successfully
 *       404:
 *         description: Pago, Precio-Usuario relationship, or Producto not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updatePago)

/**
 * @swagger
 * /api/pagos/{id}:
 *   delete:
 *     summary: Delete a pago
 *     description: Soft delete a pago by ID (sets is_delete to true)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago deleted successfully
 *       404:
 *         description: Pago not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deletePago)

/**
 * @swagger
 * /api/pagos/{id}/hard:
 *   delete:
 *     summary: Permanently delete a pago
 *     description: Hard delete a pago by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pago permanently deleted
 *       404:
 *         description: Pago not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete("/:id/hard", protect, hardDeletePago)

export default router

