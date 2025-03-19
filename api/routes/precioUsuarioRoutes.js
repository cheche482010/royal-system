import express from "express"
import {
  getAllPrecioUsuarios,
  getPrecioUsuarioById,
  getPrecioUsuarioByUsuarioId,
  createPrecioUsuario,
  updatePrecioUsuario,
  deletePrecioUsuario,
  hardDeletePrecioUsuario,
} from "../controllers/precioUsuarioController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /api/precio-usuarios:
 *   get:
 *     summary: Get all precio-usuario relationships
 *     description: Retrieve a list of all active precio-usuario relationships
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Precio Usuarios
 *     responses:
 *       200:
 *         description: A list of precio-usuario relationships
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllPrecioUsuarios)

/**
 * @swagger
 * /api/precio-usuarios/{id}:
 *   get:
 *     summary: Get a precio-usuario relationship by ID
 *     description: Retrieve a single precio-usuario relationship by its ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Precio Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Precio-Usuario relationship details
 *       404:
 *         description: Relationship not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getPrecioUsuarioById)

/**
 * @swagger
 * /api/precio-usuarios/usuario/{usuario_id}:
 *   get:
 *     summary: Get precio-usuario relationships by usuario ID
 *     description: Retrieve all precio-usuario relationships for a specific usuario
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Precio Usuarios
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of precio-usuario relationships for the usuario
 *       401:
 *         description: Unauthorized
 */
router.get("/usuario/:usuario_id", protect, getPrecioUsuarioByUsuarioId)

/**
 * @swagger
 * /api/precio-usuarios:
 *   post:
 *     summary: Create a new precio-usuario relationship
 *     description: Create a new relationship between a usuario and a precio
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Precio Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               precio_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Relationship created successfully
 *       400:
 *         description: Invalid input or relationship already exists
 *       404:
 *         description: Usuario or Precio not found
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createPrecioUsuario)

/**
 * @swagger
 * /api/precio-usuarios/{id}:
 *   put:
 *     summary: Update a precio-usuario relationship
 *     description: Update a relationship between a usuario and a precio
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Precio Usuarios
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
 *               precio_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Relationship updated successfully
 *       404:
 *         description: Relationship, Usuario, or Precio not found
 *       400:
 *         description: Invalid input or duplicate relationship
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updatePrecioUsuario)

/**
 * @swagger
 * /api/precio-usuarios/{id}:
 *   delete:
 *     summary: Delete a precio-usuario relationship
 *     description: Soft delete a relationship by ID (sets is_delete to true)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Precio Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relationship deleted successfully
 *       404:
 *         description: Relationship not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deletePrecioUsuario)

/**
 * @swagger
 * /api/precio-usuarios/{id}/hard:
 *   delete:
 *     summary: Permanently delete a precio-usuario relationship
 *     description: Hard delete a relationship by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Precio Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relationship permanently deleted
 *       404:
 *         description: Relationship not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete("/:id/hard", protect, hardDeletePrecioUsuario)

export default router

