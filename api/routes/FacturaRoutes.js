import express from "express"
import {
  getAllFacturas,
  getFacturaById,
  createFactura,
  anularFactura,
  deleteFactura,
} from "../controllers/FacturaController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /facturas:
 *   get:
 *     summary: Get all facturas
 *     description: Retrieve a list of all facturas
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Facturas
 *     responses:
 *       200:
 *         description: A list of facturas
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllFacturas)

/**
 * @swagger
 * /facturas/{id}:
 *   get:
 *     summary: Get a factura by ID
 *     description: Retrieve a single factura by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Facturas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Factura details
 *       404:
 *         description: Factura not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getFacturaById)

/**
 * @swagger
 * /facturas:
 *   post:
 *     summary: Create a new factura
 *     description: Create a new factura for an orden
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Facturas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orden_id:
 *                 type: integer
 *               numero_factura:
 *                 type: string
 *               fecha_emision:
 *                 type: string
 *                 format: date
 *               subtotal:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Factura created successfully
 *       400:
 *         description: Invalid input or factura already exists for this orden
 *       404:
 *         description: Orden not found
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createFactura)

/**
 * @swagger
 * /facturas/{id}/anular:
 *   put:
 *     summary: Anular factura
 *     description: Anular (cancel) a factura by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Facturas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Factura anulada successfully
 *       400:
 *         description: Factura already anulada
 *       404:
 *         description: Factura not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id/anular", protect, anularFactura)

/**
 * @swagger
 * /facturas/{id}:
 *   delete:
 *     summary: Delete a factura
 *     description: Soft delete a factura by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Facturas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Factura deleted successfully
 *       404:
 *         description: Factura not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteFactura)

export default router