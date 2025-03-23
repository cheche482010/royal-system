import express from "express"
import {
  getAllPagos,
  getPagoById,
  getPagosByOrden,
  createPago,
  updatePago,
  deletePago,
  hardDeletePago,
} from "../controllers/PagoController.js"
import { protect } from "../middleware/auth.js"
import upload from "../middleware/upload.js"

const router = express.Router()

/**
 * @swagger
 * /pagos:
 *   get:
 *     summary: Get all pagos
 *     description: Retrieve a list of all pagos
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pagos
 *     responses:
 *       200:
 *         description: A list of pagos
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllPagos)

/**
 * @swagger
 * /pagos/{id}:
 *   get:
 *     summary: Get a pago by ID
 *     description: Retrieve a single pago by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pagos
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
 * /pagos/orden/{orden_id}:
 *   get:
 *     summary: Get pagos by orden
 *     description: Retrieve all pagos for a specific orden
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pagos
 *     parameters:
 *       - in: path
 *         name: orden_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of pagos for the orden
 *       404:
 *         description: Orden not found
 *       401:
 *         description: Unauthorized
 */
router.get("/orden/:orden_id", protect, getPagosByOrden)

/**
 * @swagger
 * /pagos:
 *   post:
 *     summary: Create a new pago
 *     description: Create a new pago
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pagos
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               orden_id:
 *                 type: integer
 *               metodo_pago_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               comprobante_img:
 *                 type: string
 *                 format: binary
 *               numero_referencia:
 *                 type: string
 *               monto:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Pago created successfully
 *       400:
 *         description: Invalid input or missing comprobante
 *       404:
 *         description: Orden or método de pago not found
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, upload.single("comprobante_img"), createPago)

/**
 * @swagger
 * /pagos/{id}:
 *   put:
 *     summary: Update a pago
 *     description: Update a pago by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pagos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               metodo_pago_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               comprobante_img:
 *                 type: string
 *                 format: binary
 *               numero_referencia:
 *                 type: string
 *               monto:
 *                 type: number
 *                 format: float
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Pago updated successfully
 *       404:
 *         description: Pago or método de pago not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, upload.single("comprobante_img"), updatePago)

/**
 * @swagger
 * /pagos/{id}:
 *   delete:
 *     summary: Delete a pago
 *     description: Soft delete a pago by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pagos
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
 * /pagos/{id}/hard:
 *   delete:
 *     summary: Permanently delete a pago
 *     description: Hard delete a pago by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Pagos
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
 */
router.delete("/:id/hard", protect, hardDeletePago)

export default router