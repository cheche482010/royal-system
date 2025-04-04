import express from "express"
import {
  getAllCoupons,
  getCouponById,
  getCouponByCode,
  createCoupon,
  updateCoupon,
  deactivateCoupon,
  validateCoupon,
} from "../controllers/CouponController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get all coupons
 *     description: Retrieve a list of all active coupons
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Coupons
 *     responses:
 *       200:
 *         description: A list of coupons
 *       401:
 *         description: Unauthorized
 */
router.get("/", protect, getAllCoupons)

/**
 * @swagger
 * /coupons/{id}:
 *   get:
 *     summary: Get coupon by ID
 *     description: Retrieve a specific coupon by its ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Coupons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Coupon details
 *       404:
 *         description: Coupon not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", protect, getCouponById)

/**
 * @swagger
 * /coupons/code/{codigo}:
 *   get:
 *     summary: Get coupon by code
 *     description: Retrieve a specific coupon by its code
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Coupons
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coupon details
 *       404:
 *         description: Coupon not found or expired
 *       401:
 *         description: Unauthorized
 */
router.get("/code/:codigo", protect, getCouponByCode)

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Create a new coupon
 *     description: Create a new coupon with the provided details
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Coupons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       400:
 *         description: Invalid input or coupon code already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.post("/", protect, createCoupon)

/**
 * @swagger
 * /coupons/{id}:
 *   put:
 *     summary: Update a coupon
 *     description: Update a coupon with the provided details
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Coupons
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
 *               codigo:
 *                 type: string
 *               fecha_inicio:
 *                 type: string
 *                 format: date-time
 *               fecha_fin:
 *                 type: string
 *                 format: date-time
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       400:
 *         description: Invalid input or coupon code already exists
 *       404:
 *         description: Coupon not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.put("/:id", protect, updateCoupon)

/**
 * @swagger
 * /coupons/{id}:
 *   delete:
 *     summary: Deactivate a coupon
 *     description: Deactivate a coupon (soft delete)
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Coupons
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Coupon deactivated successfully
 *       404:
 *         description: Coupon not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.delete("/:id", protect, deactivateCoupon)

/**
 * @swagger
 * /coupons/validate:
 *   post:
 *     summary: Validate a coupon
 *     description: Check if a coupon is valid and active
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Coupons
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Coupon is valid
 *       404:
 *         description: Invalid or expired coupon
 *       401:
 *         description: Unauthorized
 */
router.post("/validate", protect, validateCoupon)

export default router

