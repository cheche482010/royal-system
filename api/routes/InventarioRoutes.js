import express from "express"
import {
  getAllInventario,
  getInventarioById,
  createInventario,
  updateInventario,
  deleteInventario,
  getLowStock,
} from "../controllers/InventarioController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /inventario:
 *   get:
 *     summary: Get all inventario
 *     description: Retrieve a list of all inventario records
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inventario
 *     responses:
 *       200:
 *         description: A list of inventario records
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllInventario)

/**
 * @swagger
 * /inventario/low-stock:
 *   get:
 *     summary: Get low stock inventario
 *     description: Retrieve inventario records with low stock
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inventario
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *         description: Threshold for low stock (default 10)
 *     responses:
 *       200:
 *         description: A list of low stock inventario records
 *       401:
 *         description: Unauthorized
 */
router.get("/low-stock", protect, getLowStock)

/**
 * @swagger
 * /inventario/{id}:
 *   get:
 *     summary: Get an inventario record by ID
 *     description: Retrieve a single inventario record by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inventario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inventario record details
 *       404:
 *         description: Inventario record not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getInventarioById)

/**
 * @swagger
 * /inventario:
 *   post:
 *     summary: Create a new inventario record
 *     description: Create a new inventario record
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inventario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad_inicial:
 *                 type: integer
 *               lote:
 *                 type: string
 *               estado:
 *                 type: string
 *                 enum: [Disponible, Reservado, Agotado]
 *               fecha_ingreso:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Inventario record created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createInventario)

/**
 * @swagger
 * /inventario/{id}:
 *   put:
 *     summary: Update an inventario record
 *     description: Update an inventario record by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inventario
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
 *               cantidad_actual:
 *                 type: integer
 *               estado:
 *                 type: string
 *                 enum: [Disponible, Reservado, Agotado]
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Inventario record updated successfully
 *       404:
 *         description: Inventario record not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updateInventario)

/**
 * @swagger
 * /inventario/{id}:
 *   delete:
 *     summary: Delete an inventario record
 *     description: Soft delete an inventario record by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Inventario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inventario record deleted successfully
 *       400:
 *         description: Cannot delete inventario with associated productos
 *       404:
 *         description: Inventario record not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteInventario)

export default router