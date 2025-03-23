import express from "express"
import {
  getAllProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  searchProductos,
} from "../controllers/ProductoController.js"
import { protect } from "../middleware/auth.js"
import upload from "../middleware/upload.js"

const router = express.Router()

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Get all productos
 *     description: Retrieve a list of all productos
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: A list of productos
 */
router.get("/", getAllProductos)

/**
 * @swagger
 * /productos/search:
 *   get:
 *     summary: Search productos
 *     description: Search productos by query, categoria, or marca
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term for codigo, nombre, or descripcion
 *       - in: query
 *         name: categoria_id
 *         schema:
 *           type: integer
 *         description: Filter by categoria ID
 *       - in: query
 *         name: marca_id
 *         schema:
 *           type: integer
 *         description: Filter by marca ID
 *     responses:
 *       200:
 *         description: A list of matching productos
 */
router.get("/search", searchProductos)

/**
 * @swagger
 * /productos/{id}:
 *   get:
 *     summary: Get a producto by ID
 *     description: Retrieve a single producto by ID
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto details
 *       404:
 *         description: Producto not found
 */
router.get("/:id", getProductoById)

/**
 * @swagger
 * /productos:
 *   post:
 *     summary: Create a new producto
 *     description: Create a new producto
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               producto_img:
 *                 type: string
 *                 format: binary
 *               precio_unidad:
 *                 type: number
 *                 format: float
 *               precio_tienda:
 *                 type: number
 *                 format: float
 *               precio_distribuidor:
 *                 type: number
 *                 format: float
 *               marca_id:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *               cantidad_inicial:
 *                 type: integer
 *               lote:
 *                 type: string
 *     responses:
 *       201:
 *         description: Producto created successfully
 *       400:
 *         description: Invalid input or producto already exists
 *       404:
 *         description: Categoria or marca not found
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, upload.single("producto_img"), createProducto)

/**
 * @swagger
 * /productos/{id}:
 *   put:
 *     summary: Update a producto
 *     description: Update a producto by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Productos
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
 *               codigo:
 *                 type: string
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               producto_img:
 *                 type: string
 *                 format: binary
 *               precio_unidad:
 *                 type: number
 *                 format: float
 *               precio_tienda:
 *                 type: number
 *                 format: float
 *               precio_distribuidor:
 *                 type: number
 *                 format: float
 *               marca_id:
 *                 type: integer
 *               categoria_id:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Producto updated successfully
 *       400:
 *         description: Invalid input or producto already exists
 *       404:
 *         description: Producto, categoria, or marca not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, upload.single("producto_img"), updateProducto)

/**
 * @swagger
 * /productos/{id}:
 *   delete:
 *     summary: Delete a producto
 *     description: Soft delete a producto by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Producto deleted successfully
 *       404:
 *         description: Producto not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteProducto)

export default router