// routes/CategoriaRoutes.js
import express from "express"
import {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../controllers/CategoriaController.js"
import { protect } from "../middleware/auth.js"
const router = express.Router()

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Get all categorias
 *     description: Retrieve a list of all categorias
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categorias
 *     responses:
 *       200:
 *         description: List of categorias
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllCategorias)

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Get a categoria by ID
 *     description: Retrieve a specific categoria
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categorias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Categoria not found
 */
router.get("/:id", protect, getCategoriaById)

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Create a new categoria
 *     description: Create a new categoria record
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categorias
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               codigo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createCategoria)

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Update a categoria
 *     description: Update an existing categoria record
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categorias
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
 *               nombre:
 *                 type: string
 *               codigo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Categoria updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Categoria not found
 */
router.put("/:id", protect, updateCategoria)

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Delete a categoria
 *     description: Soft delete a categoria record
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categorias
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoria deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Categoria not found
 */
router.delete("/:id", protect, deleteCategoria)

export default router