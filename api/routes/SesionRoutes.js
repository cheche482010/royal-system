import express from "express"
import {
  getAllSesiones,
  getSesionesByUsuario,
  createSesion,
  closeSesion,
  closeAllSesiones,
  verifyToken,
} from "../controllers/SesionController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /sesiones:
 *   get:
 *     summary: Get all sesiones
 *     description: Retrieve a list of all sesiones
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Sesiones
 *     responses:
 *       200:
 *         description: A list of sesiones
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllSesiones)

/**
 * @swagger
 * /sesiones/usuario/{usuario_id}:
 *   get:
 *     summary: Get sesiones by usuario
 *     description: Retrieve all sesiones for a specific usuario
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Sesiones
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of sesiones for the usuario
 *       404:
 *         description: Usuario not found
 *       401:
 *         description: Unauthorized
 */
router.get("/usuario/:usuario_id", protect, getSesionesByUsuario)

/**
 * @swagger
 * /sesiones/verify:
 *   post:
 *     summary: Verify token
 *     description: Verify if a token is valid and active
 *     tags:
 *       - Sesiones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token is valid
 *       400:
 *         description: Token is required
 *       401:
 *         description: Invalid or expired token
 */
router.post("/verify", verifyToken)

/**
 * @swagger
 * /sesiones:
 *   post:
 *     summary: Create a new sesion
 *     description: Create a new sesion for a usuario
 *     tags:
 *       - Sesiones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               ip:
 *                 type: string
 *               agente_usuario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sesion created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Usuario not found
 */
router.post("/", createSesion)

/**
 * @swagger
 * /sesiones/{id}:
 *   put:
 *     summary: Close a sesion
 *     description: Close a sesion by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Sesiones
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sesion closed successfully
 *       404:
 *         description: Sesion not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, closeSesion)

/**
 * @swagger
 * /sesiones/usuario/{usuario_id}/close-all:
 *   put:
 *     summary: Close all sesiones for a usuario
 *     description: Close all active sesiones for a specific usuario
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Sesiones
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: All sesiones closed successfully
 *       404:
 *         description: Usuario not found
 *       401:
 *         description: Unauthorized
 */
router.put("/usuario/:usuario_id/close-all", protect, closeAllSesiones)

export default router