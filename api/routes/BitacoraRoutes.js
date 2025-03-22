// routes/BitacoraRoutes.js
import express from "express"
import {
  getAllBitacoras,
  getBitacoraById,
  createBitacora,
  updateBitacora,
  deleteBitacora,
} from "../controllers/BitacoraController.js"
import { protect } from "../middleware/auth.js"
const router = express.Router()

/**
 * @swagger
 * /bitacoras:
 *   get:
 *     summary: Get all bitacoras
 *     description: Retrieve a list of all bitacora entries
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bitacoras
 *     responses:
 *       200:
 *         description: List of bitacoras
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllBitacoras)

/**
 * @swagger
 * /bitacoras/{id}:
 *   get:
 *     summary: Get a bitacora by ID
 *     description: Retrieve a specific bitacora entry
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bitacoras
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bitacora found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bitacora not found
 */
router.get("/:id", protect, getBitacoraById)

/**
 * @swagger
 * /bitacoras:
 *   post:
 *     summary: Create a new bitacora entry
 *     description: Create a new bitacora record
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bitacoras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               fecha:
 *                 type: string
 *                 format: date
 *               hora:
 *                 type: string
 *                 format: time
 *               accion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bitacora created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createBitacora)

/**
 * @swagger
 * /bitacoras/{id}:
 *   put:
 *     summary: Update a bitacora entry
 *     description: Update an existing bitacora record
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bitacoras
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
 *               fecha:
 *                 type: string
 *                 format: date
 *               hora:
 *                 type: string
 *                 format: time
 *               accion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bitacora updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bitacora not found
 */
router.put("/:id", protect, updateBitacora)

/**
 * @swagger
 * /bitacoras/{id}:
 *   delete:
 *     summary: Delete a bitacora entry
 *     description: Soft delete a bitacora record
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Bitacoras
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Bitacora deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Bitacora not found
 */
router.delete("/:id", protect, deleteBitacora)

export default router