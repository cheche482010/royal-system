import express from "express"
import {
  getAllBancos,
  getBancoById,
  createBanco,
  updateBanco,
  deleteBanco
} from "../controllers/BancoController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /bancos:
 *   get:
 *     summary: Obtener todos los bancos
 *     description: Retorna una lista de todos los bancos registrados
 *     tags:
 *       - Bancos
 *     responses:
 *       200:
 *         description: Lista de bancos obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Banco'
 *       401:
 *         description: No autorizado
 */
router.get("/", protect, getAllBancos)

/**
 * @swagger
 * /bancos/{id}:
 *   get:
 *     summary: Obtener un banco por ID
 *     description: Retorna los detalles de un banco específico
 *     tags:
 *       - Bancos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del banco
 *     responses:
 *       200:
 *         description: Detalles del banco
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banco'
 *       404:
 *         description: Banco no encontrado
 *       401:
 *         description: No autorizado
 */
router.get("/:id", protect, getBancoById)

/**
 * @swagger
 * /bancos:
 *   post:
 *     summary: Crear un nuevo banco
 *     description: Registra un nuevo banco en el sistema
 *     tags:
 *       - Bancos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BancoInput'
 *     responses:
 *       201:
 *         description: Banco creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banco'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 */
router.post("/", protect, createBanco)

/**
 * @swagger
 * /bancos/{id}:
 *   put:
 *     summary: Actualizar un banco
 *     description: Actualiza la información de un banco existente
 *     tags:
 *       - Bancos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del banco a actualizar
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BancoInput'
 *     responses:
 *       200:
 *         description: Banco actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banco'
 *       404:
 *         description: Banco no encontrado
 *       401:
 *         description: No autorizado
 */
router.put("/:id", protect, updateBanco)

/**
 * @swagger
 * /bancos/{id}:
 *   delete:
 *     summary: Eliminar un banco
 *     description: Elimina permanentemente un banco del sistema
 *     tags:
 *       - Bancos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del banco a eliminar
 *     responses:
 *       200:
 *         description: Banco eliminado exitosamente
 *       404:
 *         description: Banco no encontrado
 *       401:
 *         description: No autorizado
 */
router.delete("/:id", protect, deleteBanco)

export default router
