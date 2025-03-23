import { HistorialPrecio, Producto } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Obtener todo el historial de precios
export const getAllHistorialPrecios = async (req, res, next) => {
  try {
    const historial = await HistorialPrecio.findAll({
      where: { is_delete: false },
      include: [
        {
          model: Producto,
          attributes: ["id", "codigo", "nombre"],
        },
      ],
      order: [["fecha_update", "DESC"]],
    })

    return res.status(200).json({ success: true, data: historial })
  } catch (error) {
    next(error)
  }
}

// Obtener historial de precios por producto
export const getHistorialByProducto = async (req, res, next) => {
  try {
    const { producto_id } = req.params

    // Verificar si el producto existe
    const producto = await Producto.findByPk(producto_id)
    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto not found" })
    }

    const historial = await HistorialPrecio.findAll({
      where: { producto_id, is_delete: false },
      order: [["fecha_update", "DESC"]],
    })

    return res.status(200).json({ success: true, data: historial })
  } catch (error) {
    next(error)
  }
}

// Crear un nuevo registro de historial de precios
export const createHistorialPrecio = async (req, res, next) => {
  try {
    const { producto_id, precio_unidad, precio_tienda, precio_distribuidor } = req.body

    // Verificar si el producto existe
    const producto = await Producto.findByPk(producto_id)
    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto not found" })
    }

    const historial = await HistorialPrecio.create({
      producto_id,
      precio_unidad,
      precio_tienda,
      precio_distribuidor,
      fecha_update: new Date(),
    })

    // Actualizar los precios en el producto
    await producto.update({
      precio_unidad,
      precio_tienda,
      precio_distribuidor,
    })

    return res.status(201).json({ success: true, data: historial })
  } catch (error) {
    next(error)
  }
}

// Eliminar registro de historial (soft delete)
export const deleteHistorialPrecio = async (req, res, next) => {
  try {
    const { id } = req.params

    const historial = await HistorialPrecio.findOne({
      where: { id, is_delete: false },
    })

    if (!historial) {
      return res.status(404).json({ success: false, message: "Historial de precio not found" })
    }

    await historial.update({ is_delete: true, is_active: false })

    return res.status(200).json({ success: true, message: "Historial de precio deleted successfully" })
  } catch (error) {
    next(error)
  }
}