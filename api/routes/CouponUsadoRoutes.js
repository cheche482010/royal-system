// CouponUsadoRoutes.js
import express from "express"
import {
  getAllCouponsUsed,
  getCouponsUsedByUser,
  getCouponUsage,
} from "../controllers/CouponUsadoController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /coupons-used:
 *   get:
 *     summary: Obtener todos los cupones usados
 *     description: Retorna una lista de todos los cupones que han sido utilizados
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Coupons Usados
 *     responses:
 *       200:
 *         description: Lista de cupones usados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CouponUsado'
 *       401:
 *         description: No autorizado
 */
router.get("/", protect, getAllCouponsUsed)

/**
 * @swagger
 * /coupons-used/usuario/{usuario_id}:
 *   get:
 *     summary: Obtener cupones usados por un usuario
 *     description: Retorna los cupones que ha utilizado un usuario específico
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Coupons Usados
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de cupones usados por el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CouponUsado'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/usuario/:usuario_id", protect, getCouponsUsedByUser)

/**
 * @swagger
 * /coupons-used/cupon/{cupon_id}:
 *   get:
 *     summary: Obtener usos de un cupón específico
 *     description: Retorna todos los usos registrados de un cupón particular
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Coupons Usados
 *     parameters:
 *       - in: path
 *         name: cupon_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del cupón
 *     responses:
 *       200:
 *         description: Lista de usos del cupón
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CouponUsado'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cupón no encontrado
 */
router.get("/cupon/:cupon_id", protect, getCouponUsage)

export default router