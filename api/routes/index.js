import express from "express"
import UsuarioRoutes from "./UsuarioRoutes.js"

const router = express.Router()

// API health check route
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "API is running" })
})

// Mount routes
router.use("/usuarios", UsuarioRoutes)

export default router