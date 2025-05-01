import express from "express"
import * as PaymentFlowController from "../controllers/PaymentFlowController.js"
import { protect } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"

const router = express.Router()

// Create a new order from cart items
router.post("/orders", protect, PaymentFlowController.createOrder)

// Process a payment for an order
router.post("/payments", protect, upload.single("comprobante"), PaymentFlowController.processPayment)

// Verify a payment and update order status (admin only)
router.put("/payments/:id/verify", protect, PaymentFlowController.verifyPayment)

// Generate an invoice for a completed order (admin only)
router.post("/invoices", protect, PaymentFlowController.generateInvoice)

// Apply a coupon to an order
router.post("/coupons/apply", protect, PaymentFlowController.applyCoupon)

// Get pending payments for admin verification (admin only)
router.get("/payments/pending", protect, PaymentFlowController.getPendingPayments)

export default router