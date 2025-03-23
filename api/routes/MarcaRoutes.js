import express from "express"
import {
  getAllMarcas,
  getMarcaById,
  createMarca,
  updateMarca,
  deleteMarca,
  getProductosByMarca,
} from "../controllers/MarcaController.js"
import { protect } from "../middleware/auth.js"
import upload from "../middleware/upload.js"

const router = express.Router()

/**
 * @swagger
 * /marcas:
 *   get:
 *     summary: Get all marcas
 *     description: Retrieve a list of all marcas
 *     tags:
 *       - Marcas
 *     responses:
 *       200:
 *         description: A list of marcas
 */
router.get("/", getAllMarcas)

/**
 * @swagger
 * /marcas/{id}:
 *   get:
 *     summary: Get a marca by ID
 *     description: Retrieve a single marca by ID
 *     tags:
 *       - Marcas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Marca details
 *       404:
 *         description: Marca not found
 */
router.get("/:id", getMarcaById)

/**
 * @swagger
 * /marcas/{id}/productos:
 *   get:
 *     summary: Get productos by marca
 *     description: Retrieve all productos for a specific marca
 *     tags:
 *       - Marcas
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of productos in the marca
 *       404:
 *         description: Marca not found
 */
router.get("/:id/productos", getProductosByMarca)

/**
 * @swagger
 * /marcas:
 *   post:
 *     summary: Create a new marca
 *     description: Create a new marca
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Marcas
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               logo_img:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Marca created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, upload.single("logo_img"), createMarca)

/**
 * @swagger
 * /marcas/{id}:
 *   put:
 *     summary: Update a marca
 *     description: Update a marca by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Marcas
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
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               logo_img:
 *                 type: string
 *                 format: binary
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Marca updated successfully
 *       404:
 *         description: Marca not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, upload.single("logo_img"), updateMarca)

/**
 * @swagger
 * /marcas/{id}:
 *   delete:
 *     summary: Delete a marca
 *     description: Soft delete a marca by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Marcas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Marca deleted successfully
 *       400:
 *         description: Cannot delete marca with associated productos
 *       404:
 *         description: Marca not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteMarca)

export default router