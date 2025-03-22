// Initialize Sequelize and import models
import Usuario from './Usuario.js'
import Bitacora from './Bitacora.js'
import Carrito from './Carrito.js'
import Orden from './Orden.js'
import DetalleOrden from './DetalleOrden.js'
import Factura from './Factura.js'
import Pago from './Pago.js'
import MetodoPago from './MetodoPago.js'
import Producto from './Producto.js'
import Inventario from './Inventario.js'
import Marca from './Marca.js'
import Categoria from './Categoria.js'
import HistorialPrecio from './HistorialPrecio.js'
import Sesion from './Sesion.js'
import DolarBCV from './DolarBCV.js'

// Relaciones uno a muchos
Usuario.hasMany(Bitacora, { foreignKey: 'usuario_id' })
Usuario.hasMany(Carrito, { foreignKey: 'usuario_id' })
Usuario.hasMany(Orden, { foreignKey: 'usuario_id' })
Usuario.hasMany(Sesion, { foreignKey: 'usuario_id' })

Orden.hasMany(DetalleOrden, { foreignKey: 'orden_id' })
Orden.hasOne(Factura, { foreignKey: 'orden_id' })
Orden.hasMany(Pago, { foreignKey: 'orden_id' })

MetodoPago.hasMany(Pago, { foreignKey: 'metodo_pago_id' })

Producto.hasMany(DetalleOrden, { foreignKey: 'producto_id' })
Producto.hasOne(Inventario, { foreignKey: 'inventario_id' })
Producto.hasMany(HistorialPrecio, { foreignKey: 'producto_id' })

Marca.hasMany(Producto, { foreignKey: 'marca_id' })
Categoria.hasMany(Producto, { foreignKey: 'categoria_id' })

// Exportar todas las relaciones
export {
  Usuario,
  Bitacora,
  Carrito,
  Orden,
  DetalleOrden,
  Factura,
  Pago,
  MetodoPago,
  Producto,
  Inventario,
  Marca,
  Categoria,
  HistorialPrecio,
  Sesion,
  DolarBCV
}

