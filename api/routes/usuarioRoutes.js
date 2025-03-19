import express from "express"
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  hardDeleteUsuario,
} from "../controllers/usuarioController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Get all usuarios
 *     description: Retrieve a list of all active usuarios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of usuarios
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllUsuarios)

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Get a usuario by ID
 *     description: Retrieve a single usuario by their ID
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
 *         description: Usuario details
 *       404:
 *         description: Usuario not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getUsuarioById)

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Create a new usuario
 *     description: Create a new usuario record
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rif_cedula:
 *                 type: string
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               registro_mercantil:
 *                 type: string
 *               volumen_compra:
 *                 type: integer
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario created successfully
 *       400:
 *         description: Invalid input or usuario already exists
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createUsuario)

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Update a usuario
 *     description: Update usuario details
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
 *               rif_cedula:
 *                 type: string
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               registro_mercantil:
 *                 type: string
 *               volumen_compra:
 *                 type: integer
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario updated successfully
 *       404:
 *         description: Usuario not found
 *       400:
 *         description: Invalid input or duplicate values
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updateUsuario)

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Delete a usuario
 *     description: Soft delete a usuario by ID (sets is_delete to true)
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
 *         description: Usuario deleted successfully
 *       404:
 *         description: Usuario not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteUsuario)

/**
 * @swagger
 * /usuarios/{id}/hard:
 *   delete:
 *     summary: Permanently delete a usuario
 *     description: Hard delete a usuario by ID (admin only)
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
 *         description: Usuario permanently deleted
 *       404:
 *         description: Usuario not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete("/:id/hard", protect, hardDeleteUsuario)

export default router

