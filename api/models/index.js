import Usuario from "./Usuario.js"
import Bitacora from "./Bitacora.js"
import Carrito from "./Carrito.js"
import Categoria from "./Categoria.js"
import DetalleOrden from "./DetalleOrden.js"
import DolarBCV from "./DolarBCV.js"
import Factura from "./Factura.js"
import HistorialPrecio from "./HistorialPrecio.js"
import Inventario from "./Inventario.js"
import Marca from "./Marca.js"
import MetodoPago from "./MetodoPago.js"
import Orden from "./Orden.js"
import Pago from "./Pago.js"
import Producto from "./Producto.js"
import Sesion from "./Sesion.js"

// Definir relaciones
Usuario.hasMany(Bitacora, { foreignKey: "usuario_id" })
Bitacora.belongsTo(Usuario, { foreignKey: "usuario_id" })

Usuario.hasMany(Carrito, { foreignKey: "usuario_id" })
Carrito.belongsTo(Usuario, { foreignKey: "usuario_id" })
Producto.hasMany(Carrito, { foreignKey: "producto_id" })
Carrito.belongsTo(Producto, { foreignKey: "producto_id" })

Producto.hasMany(HistorialPrecio, { foreignKey: "producto_id" })
HistorialPrecio.belongsTo(Producto, { foreignKey: "producto_id" })

Marca.hasMany(Producto, { foreignKey: "marca_id" })
Producto.belongsTo(Marca, { foreignKey: "marca_id" })

Categoria.hasMany(Producto, { foreignKey: "categoria_id" })
Producto.belongsTo(Categoria, { foreignKey: "categoria_id" })

Inventario.hasOne(Producto, { foreignKey: "inventario_id" })
Producto.belongsTo(Inventario, { foreignKey: "inventario_id" })

Usuario.hasMany(Orden, { foreignKey: "usuario_id" })
Orden.belongsTo(Usuario, { foreignKey: "usuario_id" })

Orden.hasMany(DetalleOrden, { foreignKey: "orden_id" })
DetalleOrden.belongsTo(Orden, { foreignKey: "orden_id" })
Producto.hasMany(DetalleOrden, { foreignKey: "producto_id" })
DetalleOrden.belongsTo(Producto, { foreignKey: "producto_id" })

Orden.hasOne(Factura, { foreignKey: "orden_id" })
Factura.belongsTo(Orden, { foreignKey: "orden_id" })

Orden.hasMany(Pago, { foreignKey: "orden_id" })
Pago.belongsTo(Orden, { foreignKey: "orden_id" })
MetodoPago.hasMany(Pago, { foreignKey: "metodo_pago_id" })
Pago.belongsTo(MetodoPago, { foreignKey: "metodo_pago_id" })

Usuario.hasMany(Sesion, { foreignKey: "usuario_id" })
Sesion.belongsTo(Usuario, { foreignKey: "usuario_id" })

export {
  Usuario,
  Bitacora,
  Carrito,
  Categoria,
  DetalleOrden,
  DolarBCV,
  Factura,
  HistorialPrecio,
  Inventario,
  Marca,
  MetodoPago,
  Orden,
  Pago,
  Producto,
  Sesion,
}