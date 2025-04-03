import express from "express"
import {
  getAllCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
  getProductosByCategoria,
} from "../controllers/CategoriaController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /categorias:
 *   get:
 *     summary: Get all categorias
 *     description: Retrieve a list of all categorias
 *     tags:
 *       - Categorias
 *     responses:
 *       200:
 *         description: A list of categorias
 */
router.get("/", getAllCategorias)

/**
 * @swagger
 * /categorias/{id}:
 *   get:
 *     summary: Get a categoria by ID
 *     description: Retrieve a single categoria by ID
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
 *         description: Categoria details
 *       404:
 *         description: Categoria not found
 */
router.get("/:id", getCategoriaById)

/**
 * @swagger
 * /categorias/{id}/productos:
 *   get:
 *     summary: Get productos by categoria
 *     description: Retrieve all productos for a specific categoria
 *     tags:
 *       - Categorias
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of productos in the categoria
 *       404:
 *         description: Categoria not found
 */
router.get("/:id/productos", getProductosByCategoria)

/**
 * @swagger
 * /categorias:
 *   post:
 *     summary: Create a new categoria
 *     description: Create a new categoria
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
 *     responses:
 *       201:
 *         description: Categoria created successfully
 *       400:
 *         description: Invalid input or categoria already exists
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createCategoria)

/**
 * @swagger
 * /categorias/{id}:
 *   put:
 *     summary: Update a categoria
 *     description: Update a categoria by ID
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
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               codigo:
 *                 type: string
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Categoria updated successfully
 *       400:
 *         description: Invalid input or categoria already exists
 *       404:
 *         description: Categoria not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updateCategoria)

/**
 * @swagger
 * /categorias/{id}:
 *   delete:
 *     summary: Delete a categoria
 *     description: Soft delete a categoria by ID
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
 *       400:
 *         description: Cannot delete categoria with associated productos
 *       404:
 *         description: Categoria not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteCategoria)

export default router