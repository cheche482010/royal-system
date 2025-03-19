import express from "express"
import userRoutes from "./userRoutes.js"
import exampleRoutes from "./exampleRoutes.js"

const router = express.Router()

// API health check route
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "API is running" })
})

// Mount routes
router.use("/users", userRoutes)
router.use("/examples", exampleRoutes)

export default router

