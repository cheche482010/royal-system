import express from "express"
import {
  getAllPrecios,
  getPrecioById,
  createPrecio,
  updatePrecio,
  deletePrecio,
  hardDeletePrecio,
} from "../controllers/precioController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /api/precios:
 *   get:
 *     summary: Get all precios
 *     description: Retrieve a list of all active precios
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Precios
 *     responses:
 *       200:
 *         description: A list of precios
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllPrecios)

/**
 * @swagger
 * /api/precios/{id}:
 *   get:
 *     summary: Get a precio by ID
 *     description: Retrieve a single precio by its ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Precios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Precio details
 *       404:
 *         description: Precio not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getPrecioById)

/**
 * @swagger
 * /api/precios:
 *   post:
 *     summary: Create a new precio
 *     description: Create a new precio record
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Precios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo_precio:
 *                 type: integer
 *               nombre_precio:
 *                 type: string
 *               precio_unidad:
 *                 type: number
 *                 format: decimal
 *     responses:
 *       201:
 *         description: Precio created successfully
 *       400:
 *         description: Invalid input or precio already exists
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createPrecio)

/**
 * @swagger
 * /api/precios/{id}:
 *   put:
 *     summary: Update a precio
 *     description: Update precio details
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Precios
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
 *               codigo_precio:
 *                 type: integer
 *               nombre_precio:
 *                 type: string
 *               precio_unidad:
 *                 type: number
 *                 format: decimal
 *     responses:
 *       200:
 *         description: Precio updated successfully
 *       404:
 *         description: Precio not found
 *       400:
 *         description: Invalid input or duplicate values
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updatePrecio)

/**
 * @swagger
 * /api/precios/{id}:
 *   delete:
 *     summary: Delete a precio
 *     description: Soft delete a precio by ID (sets is_delete to true)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Precios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Precio deleted successfully
 *       404:
 *         description: Precio not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deletePrecio)

/**
 * @swagger
 * /api/precios/{id}/hard:
 *   delete:
 *     summary: Permanently delete a precio
 *     description: Hard delete a precio by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Precios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Precio permanently deleted
 *       404:
 *         description: Precio not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete("/:id/hard", protect, hardDeletePrecio)

export default router

