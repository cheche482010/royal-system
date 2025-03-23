import express from "express"
import {
  getAllMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago,
} from "../controllers/MetodoPagoController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /metodos-pago:
 *   get:
 *     summary: Get all métodos de pago
 *     description: Retrieve a list of all métodos de pago
 *     tags:
 *       - Métodos de Pago
 *     responses:
 *       200:
 *         description: A list of métodos de pago
 */
router.get("/", getAllMetodosPago)

/**
 * @swagger
 * /metodos-pago/{id}:
 *   get:
 *     summary: Get a método de pago by ID
 *     description: Retrieve a single método de pago by ID
 *     tags:
 *       - Métodos de Pago
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Método de pago details
 *       404:
 *         description: Método de pago not found
 */
router.get("/:id", getMetodoPagoById)

/**
 * @swagger
 * /metodos-pago:
 *   post:
 *     summary: Create a new método de pago
 *     description: Create a new método de pago
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Métodos de Pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Método de pago created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createMetodoPago)

/**
 * @swagger
 * /metodos-pago/{id}:
 *   put:
 *     summary: Update a método de pago
 *     description: Update a método de pago by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Métodos de Pago
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
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Método de pago updated successfully
 *       404:
 *         description: Método de pago not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updateMetodoPago)

/**
 * @swagger
 * /metodos-pago/{id}:
 *   delete:
 *     summary: Delete a método de pago
 *     description: Soft delete a método de pago by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Métodos de Pago
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Método de pago deleted successfully
 *       400:
 *         description: Cannot delete método de pago with associated pagos
 *       404:
 *         description: Método de pago not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteMetodoPago)

export default router