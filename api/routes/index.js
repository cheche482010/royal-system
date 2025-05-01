import express from "express"
import UsuarioRoutes from "./UsuarioRoutes.js"
import BitacoraRoutes from "./BitacoraRoutes.js"
import CarritoRoutes from "./CarritoRoutes.js"
import CarritoProductoRoutes from "./CarritoProductoRoutes.js"
import CouponRoutes from "./CouponRoutes.js"
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
import BancoRoutes from "./BancoRoutes.js"
import CouponUsadoRoutes from "./CouponUsadoRoutes.js"
import PaymentFlowRoutes from "./PaymentFlowRoutes.js"
import EnvioRoutes from "./EnvioRoutes.js"

const router = express.Router()

// API health check route
router.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "API is running" })
})

// Mount routes
router.use("/usuarios", UsuarioRoutes)
router.use("/bitacora", BitacoraRoutes)
router.use("/cart", CarritoRoutes)
router.use("/cart-products", CarritoProductoRoutes)
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
router.use("/bancos", BancoRoutes)
router.use("/coupons", CouponRoutes)
router.use("/coupons-used", CouponUsadoRoutes)
router.use("/payment-flows", PaymentFlowRoutes)
router.use("/envios", EnvioRoutes)

export default router