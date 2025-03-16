import express from "express"
import {
  getAllExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample,
} from "../controllers/exampleController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /api/examples:
 *   get:
 *     summary: Get all examples
 *     description: Retrieve a list of all examples
 *     responses:
 *       200:
 *         description: A list of examples
 */
router.get("/", getAllExamples)

/**
 * @swagger
 * /api/examples/{id}:
 *   get:
 *     summary: Get an example by ID
 *     description: Retrieve a single example by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Example details
 *       404:
 *         description: Example not found
 */
router.get("/:id", getExampleById)

/**
 * @swagger
 * /api/examples:
 *   post:
 *     summary: Create a new example
 *     description: Create a new example (protected route)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Example created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", protect, createExample)

/**
 * @swagger
 * /api/examples/{id}:
 *   put:
 *     summary: Update an example
 *     description: Update example details (protected route)
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Example updated successfully
 *       404:
 *         description: Example not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", protect, updateExample)

/**
 * @swagger
 * /api/examples/{id}:
 *   delete:
 *     summary: Delete an example
 *     description: Delete an example by ID (protected route)
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
 *         description: Example deleted successfully
 *       404:
 *         description: Example not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", protect, deleteExample)

export default router

