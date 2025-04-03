import { DetalleOrden, Orden, Producto } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Obtener todos los detalles de órdenes
export const getAllDetallesOrden = async (req, res, next) => {
  try {
    const detalles = await DetalleOrden.findAll({
      include: [
        {
          model: Orden,
          attributes: ["id", "usuario_id", "monto_total", "status"],
        },
        {
          model: Producto,
          attributes: ["id", "codigo", "nombre", "descripcion"],
        },
      ],
      order: [["id", "ASC"]],
    })

    return res.status(200).json({ success: true, data: detalles })
  } catch (error) {
    next(error)
  }
}

// Obtener detalle de orden por ID
export const getDetalleOrdenById = async (req, res, next) => {
  try {
    const { id } = req.params

    const detalle = await DetalleOrden.findOne({
      where: { id },
      include: [
        {
          model: Orden,
          attributes: ["id", "usuario_id", "monto_total", "status"],
        },
        {
          model: Producto,
          attributes: ["id", "codigo", "nombre", "descripcion", "producto_img"],
        },
      ],
    })

    if (!detalle) {
      return res.status(404).json({ success: false, message: "Detalle de orden not found" })
    }

    return res.status(200).json({ success: true, data: detalle })
  } catch (error) {
    next(error)
  }
}

// Obtener detalles por orden
export const getDetallesByOrden = async (req, res, next) => {
  try {
    const { orden_id } = req.params

    // Verificar si la orden existe
    const orden = await Orden.findByPk(orden_id)
    if (!orden) {
      return res.status(404).json({ success: false, message: "Orden not found" })
    }

    const detalles = await DetalleOrden.findAll({
      where: { orden_id },
      include: [
        {
          model: Producto,
          attributes: ["id", "codigo", "nombre", "descripcion", "producto_img", "precio_unidad"],
        },
      ],
      order: [["id", "ASC"]],
    })

    return res.status(200).json({ success: true, data: detalles })
  } catch (error) {
    next(error)
  }
}

// Crear un nuevo detalle de orden
export const createDetalleOrden = async (req, res, next) => {
  try {
    const { orden_id, producto_id, cantidad, precio } = req.body

    // Verificar si la orden existe
    const orden = await Orden.findByPk(orden_id)
    if (!orden) {
      return res.status(404).json({ success: false, message: "Orden not found" })
    }

    // Verificar si el producto existe
    const producto = await Producto.findOne({
      where: { id: producto_id, is_delete: false, is_active: true },
    })

    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto not found" })
    }

    // Crear el detalle de orden
    const detalle = await DetalleOrden.create({
      orden_id,
      producto_id,
      cantidad,
      precio: precio || producto.precio_unidad,
    })

    // Actualizar el monto total de la orden
    const detalles = await DetalleOrden.findAll({
      where: { orden_id },
    })

    let montoTotal = 0
    for (const item of detalles) {
      montoTotal += item.precio * item.cantidad
    }

    await orden.update({ monto_total: montoTotal })

    return res.status(201).json({ success: true, data: detalle })
  } catch (error) {
    next(error)
  }
}

// Actualizar detalle de orden
export const updateDetalleOrden = async (req, res, next) => {
  try {
    const { id } = req.params
    const { cantidad, precio } = req.body

    const detalle = await DetalleOrden.findOne({
      where: { id },
      include: [{ model: Orden }],
    })

    if (!detalle) {
      return res.status(404).json({ success: false, message: "Detalle de orden not found" })
    }

    // Actualizar el detalle
    await detalle.update({
      cantidad: cantidad !== undefined ? cantidad : detalle.cantidad,
      precio: precio !== undefined ? precio : detalle.precio,
    })

    // Actualizar el monto total de la orden
    const detalles = await DetalleOrden.findAll({
      where: { orden_id: detalle.orden_id },
    })

    let montoTotal = 0
    for (const item of detalles) {
      montoTotal += item.precio * item.cantidad
    }

    await detalle.Orden.update({ monto_total: montoTotal })

    return res.status(200).json({ success: true, data: detalle })
  } catch (error) {
    next(error)
  }
}

// Eliminar detalle de orden
export const deleteDetalleOrden = async (req, res, next) => {
  const transaction = await sequelize.transaction()

  try {
    const { id } = req.params

    const detalle = await DetalleOrden.findOne({
      where: { id },
      include: [{ model: Orden }],
      transaction,
    })

    if (!detalle) {
      await transaction.rollback()
      return res.status(404).json({ success: false, message: "Detalle de orden not found" })
    }

    // Guardar el orden_id antes de eliminar el detalle
    const ordenId = detalle.orden_id

    // Eliminar el detalle
    await detalle.destroy({ transaction })

    // Actualizar el monto total de la orden
    const detalles = await DetalleOrden.findAll({
      where: { orden_id: ordenId },
      transaction,
    })

    let montoTotal = 0
    for (const item of detalles) {
      montoTotal += item.precio * item.cantidad
    }

    await Orden.update(
      { monto_total: montoTotal },
      {
        where: { id: ordenId },
        transaction,
      }
    )

    await transaction.commit()

    return res.status(200).json({ success: true, message: "Detalle de orden deleted successfully" })
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}