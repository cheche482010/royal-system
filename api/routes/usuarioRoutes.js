import express from "express"
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  hardDeleteUsuario,
  loginUsuario,
} from "../controllers/UsuarioController.js"
import { protect } from "../middleware/auth.js"
import upload from "../middleware/upload.js"

const router = express.Router()

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Get all usuarios
 *     description: Retrieve a list of all active usuarios
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Usuarios
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
 *     tags:
 *       - Usuarios
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
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *               documento_img:
 *                 type: string
 *                 format: binary
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               registro_mercantil_img:
 *                 type: string
 *                 format: binary
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               user_password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Admin, Employee, Customer]
 *     responses:
 *       201:
 *         description: Usuario created successfully
 *       400:
 *         description: Invalid input or usuario already exists
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  protect,
  upload.fields([
    { name: "documento_img", maxCount: 1 },
    { name: "registro_mercantil_img", maxCount: 1 },
  ]),
  createUsuario,
)

/**
 * @swagger
 * /usuarios/register:
 *   post:
 *     summary: Register a new usuario
 *     description: Create a new usuario record (public route for registration)
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *               documento_img:
 *                 type: string
 *                 format: binary
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               registro_mercantil_img:
 *                 type: string
 *                 format: binary
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               user_password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario created successfully
 *       400:
 *         description: Invalid input or usuario already exists
 */
router.post(
  "/register",
  upload.fields([
    { name: "documento_img", maxCount: 1 },
    { name: "registro_mercantil_img", maxCount: 1 },
  ]),
  createUsuario,
)

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Login a usuario
 *     description: Authenticate a usuario and return a token
 *     tags:
 *       - Usuarios
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginUsuario)

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Update a usuario
 *     description: Update usuario details
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Usuarios
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *               documento_img:
 *                 type: string
 *                 format: binary
 *               nombre:
 *                 type: string
 *               direccion:
 *                 type: string
 *               registro_mercantil_img:
 *                 type: string
 *                 format: binary
 *               correo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               user_password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [Admin, Employee, Customer]
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
router.put(
  "/:id",
  protect,
  upload.fields([
    { name: "documento_img", maxCount: 1 },
    { name: "registro_mercantil_img", maxCount: 1 },
  ]),
  updateUsuario,
)

/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Delete a usuario
 *     description: Soft delete a usuario by ID (sets is_delete to true)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Usuarios
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
 *     tags:
 *       - Usuarios
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

