import express from "express"
import UsuarioRoutes from "./UsuarioRoutes.js"
import BitacoraRoutes from "./BitacoraRoutes.js"
import CarritoRoutes from "./CarritoRoutes.js"
import CategoriaRoutes from "./CategoriaRoutes.js"
import DetalleOrdenRoutes from "./DetalleOrdenRoutes.js"
import DolarBCVRoutes from "./DolarBCVRoutes.js"
import FacturaRoutes from "./FacturaRoutes.js"
import HistorialPrecioRoutes from "./HistorialPrecioRoutes.js"
import InventarioRoutes from "./InventarioRoutes.js"
import MarcaRoutes from "./MarcaRoutes.js"
import MetodoPagoRoutes from "./MetodoPagoRoutes.js"
import OrdenRoutes from "./OrdenRoutes.js"
import PagoRoutes from "./PagoRoutes.js"
import ProductoRoutes from "./ProductoRoutes.js"
import SesionRoutes from "./SesionRoutes.js"

const router = express.Router()

// API health check route
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "API is running" })
})

// Mount routes
router.use("/usuarios", UsuarioRoutes)
router.use("/bitacora", BitacoraRoutes)
router.use("/carrito", CarritoRoutes)
router.use("/categorias", CategoriaRoutes)
router.use("/detalles-orden", DetalleOrdenRoutes)
router.use("/dolar-bcv", DolarBCVRoutes)
router.use("/facturas", FacturaRoutes)
router.use("/historial-precios", HistorialPrecioRoutes)
router.use("/inventario", InventarioRoutes)
router.use("/marcas", MarcaRoutes)
router.use("/metodos-pago", MetodoPagoRoutes)
router.use("/ordenes", OrdenRoutes)
router.use("/pagos", PagoRoutes)
router.use("/productos", ProductoRoutes)
router.use("/sesiones", SesionRoutes)

export default router