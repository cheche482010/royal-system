import express from "express"
import {
  getAllBitacoras,
  getBitacoraById,
  createBitacora,
  updateBitacora,
  deleteBitacora,
  hardDeleteBitacora,
} from "../controllers/BitacoraController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /bitacora:
 *   get:
 *     summary: Get all bitacora entries
 *     description: Retrieve a list of all bitacora entries
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bitacora
 *     responses:
 *       200:
 *         description: A list of bitacora entries
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllBitacoras)

/**
 * @swagger
 * /bitacora/{id}:
 *   get:
 *     summary: Get a bitacora entry by ID
 *     description: Retrieve a single bitacora entry by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bitacora
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bitacora entry details
 *       404:
 *         description: Bitacora entry not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getBitacoraById)

/**
 * @swagger
 * /bitacora:
 *   post:
 *     summary: Create a new bitacora entry
 *     description: Create a new bitacora entry
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bitacora
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               accion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bitacora entry created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createBitacora)

/**
 * @swagger
 * /bitacora/{id}:
 *   put:
 *     summary: Update a bitacora entry
 *     description: Update a bitacora entry by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bitacora
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
 *               usuario_id:
 *                 type: integer
 *               accion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bitacora entry updated successfully
 *       404:
 *         description: Bitacora entry not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updateBitacora)

/**
 * @swagger
 * /bitacora/{id}:
 *   delete:
 *     summary: Delete a bitacora entry
 *     description: Soft delete a bitacora entry by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bitacora
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bitacora entry deleted successfully
 *       404:
 *         description: Bitacora entry not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteBitacora)

/**
 * @swagger
 * /bitacora/{id}/hard:
 *   delete:
 *     summary: Permanently delete a bitacora entry
 *     description: Hard delete a bitacora entry by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bitacora
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bitacora entry permanently deleted
 *       404:
 *         description: Bitacora entry not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id/hard", protect, hardDeleteBitacora)

export default router