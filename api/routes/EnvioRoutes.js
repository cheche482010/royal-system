import express from "express"
import {
  getAllEnvios,
  getEnvioById,
  getEnvioByOrdenId,
  createEnvio,
  updateEnvio,
  deleteEnvio,
  hardDeleteEnvio
} from "../controllers/EnvioController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /envios:
 *   get:
 *     summary: Get all envíos
 *     description: Retrieve a list of all shipping information
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Envíos
 *     responses:
 *       200:
 *         description: A list of shipping information
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllEnvios)

/**
 * @swagger
 * /envios/{id}:
 *   get:
 *     summary: Get an envío by ID
 *     description: Retrieve a single shipping information by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Envíos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Shipping information details
 *       404:
 *         description: Shipping information not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getEnvioById)

/**
 * @swagger
 * /envios/orden/{orden_id}:
 *   get:
 *     summary: Get shipping information by order ID
 *     description: Retrieve shipping information for a specific order
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Envíos
 *     parameters:
 *       - in: path
 *         name: orden_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Shipping information for the order
 *       404:
 *         description: Order not found or shipping information not found
 *       401:
 *         description: Unauthorized
 */
router.get("/orden/:orden_id", protect, getEnvioByOrdenId)

/**
 * @swagger
 * /envios:
 *   post:
 *     summary: Create new shipping information
 *     description: Create shipping information for an order
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Envíos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orden_id:
 *                 type: integer
 *               nombre_receptor:
 *                 type: string
 *               direccion:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               estado:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Shipping information created successfully
 *       400:
 *         description: Invalid input or shipping information already exists
 *       404:
 *         description: Order not found
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createEnvio)

/**
 * @swagger
 * /envios/{id}:
 *   put:
 *     summary: Update shipping information
 *     description: Update shipping information by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Envíos
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
 *               nombre_receptor:
 *                 type: string
 *               direccion:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               estado:
 *                 type: string
 *               telefono:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Shipping information updated successfully
 *       404:
 *         description: Shipping information not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updateEnvio)

/**
 * @swagger
 * /envios/{id}:
 *   delete:
 *     summary: Delete shipping information
 *     description: Soft delete shipping information by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Envíos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Shipping information deleted successfully
 *       404:
 *         description: Shipping information not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteEnvio)

/**
 * @swagger
 * /envios/{id}/hard:
 *   delete:
 *     summary: Permanently delete shipping information
 *     description: Hard delete shipping information by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Envíos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Shipping information permanently deleted
 *       404:
 *         description: Shipping information not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id/hard", protect, hardDeleteEnvio)

export default router