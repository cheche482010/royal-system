import express from "express"
import {
  getAllTasas,
  getTasaById,
  getCurrentTasa,
  createTasa,
  updateTasa,
  deleteTasa,
} from "../controllers/DolarBCVController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /dolar-bcv:
 *   get:
 *     summary: Get all exchange rates
 *     description: Retrieve a list of all exchange rates
 *     tags:
 *       - Dolar BCV
 *     responses:
 *       200:
 *         description: A list of exchange rates
 */
router.get("/", getAllTasas)

/**
 * @swagger
 * /dolar-bcv/current:
 *   get:
 *     summary: Get current exchange rate
 *     description: Retrieve the current active exchange rate
 *     tags:
 *       - Dolar BCV
 *     responses:
 *       200:
 *         description: Current exchange rate
 *       404:
 *         description: No active exchange rate found
 */
router.get("/current", getCurrentTasa)

/**
 * @swagger
 * /dolar-bcv/{id}:
 *   get:
 *     summary: Get an exchange rate by ID
 *     description: Retrieve a single exchange rate by ID
 *     tags:
 *       - Dolar BCV
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exchange rate details
 *       404:
 *         description: Exchange rate not found
 */
router.get("/:id", getTasaById)

/**
 * @swagger
 * /dolar-bcv:
 *   post:
 *     summary: Create a new exchange rate
 *     description: Create a new exchange rate and deactivate the current one
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Dolar BCV
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tasa_cambio:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Exchange rate created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createTasa)

/**
 * @swagger
 * /dolar-bcv/{id}:
 *   put:
 *     summary: Update an exchange rate
 *     description: Update an exchange rate by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Dolar BCV
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
 *               tasa_cambio:
 *                 type: number
 *                 format: float
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Exchange rate updated successfully
 *       404:
 *         description: Exchange rate not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updateTasa)

/**
 * @swagger
 * /dolar-bcv/{id}:
 *   delete:
 *     summary: Delete an exchange rate
 *     description: Soft delete an exchange rate by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Dolar BCV
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Exchange rate deleted successfully
 *       404:
 *         description: Exchange rate not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteTasa)

export default router