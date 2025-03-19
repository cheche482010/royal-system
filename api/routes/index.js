import express from "express"
import usuarioRoutes from "./usuarioRoutes.js"
import productoRoutes from "./productoRoutes.js"
import precioRoutes from "./precioRoutes.js"
import precioUsuarioRoutes from "./precioUsuarioRoutes.js"
import pagoRoutes from "./pagoRoutes.js"

const router = express.Router()

// API health check route
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "API is running" })
})

// Mount routes
router.use("/usuarios", usuarioRoutes)
router.use("/productos", productoRoutes)
router.use("/precios", precioRoutes)
router.use("/precio-usuarios", precioUsuarioRoutes)
router.use("/pagos", pagoRoutes)

export default router