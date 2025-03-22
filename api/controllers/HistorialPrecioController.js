// controllers/HistorialPrecioController.js
import { HistorialPrecio } from "../models/index.js"
import { Op } from "sequelize"

export const getAllHistorialPrecios = async (req, res, next) => {
  try {
    const historial = await HistorialPrecio.findAll({
      where: { is_delete: false },
      include: [{ model: req.models.Producto, as: 'producto' }],
      order: [['fecha_update', 'DESC']]
    })
    return res.status(200).json({ success: true, data: historial })
  } catch (error) {
    next(error)
  }
}

export const getHistorialPrecioById = async (req, res, next) => {
  try {
    const { id } = req.params
    const historial = await HistorialPrecio.findByPk(id, {
      where: { is_delete: false },
      include: [{ model: req.models.Producto, as: 'producto' }]
    })
    if (!historial) {
      return res.status(404).json({ success: false, message: "HistorialPrecio not found" })
    }
    return res.status(200).json({ success: true, data: historial })
  } catch (error) {
    next(error)
  }
}

export const createHistorialPrecio = async (req, res, next) => {
  try {
    const { producto_id, precio_unidad, precio_tienda, precio_distribuidor, fecha_update } = req.body
    const existingPrecio = await HistorialPrecio.findOne({
      where: {
        producto_id,
        fecha_update,
        is_delete: false
      }
    })
    if (existingPrecio) {
      return res.status(400).json({
        success: false,
        message: "Price history for this date already exists"
      })
    }
    const historial = await HistorialPrecio.create({
      producto_id,
      precio_unidad,
      precio_tienda,
      precio_distribuidor,
      fecha_update,
      is_active: true,
      is_delete: false
    })
    return res.status(201).json({ success: true, data: historial })
  } catch (error) {
    next(error)
  }
}

export const updateHistorialPrecio = async (req, res, next) => {
  try {
    const { id } = req.params
    const { precio_unidad, precio_tienda, precio_distribuidor, fecha_update } = req.body
    const historial = await HistorialPrecio.findByPk(id)
    if (!historial || historial.is_delete) {
      return res.status(404).json({ success: false, message: "HistorialPrecio not found" })
    }
    await historial.update({
      precio_unidad: precio_unidad || historial.precio_unidad,
      precio_tienda: precio_tienda || historial.precio_tienda,
      precio_distribuidor: precio_distribuidor || historial.precio_distribuidor,
      fecha_update: fecha_update || historial.fecha_update
    })
    return res.status(200).json({ success: true, data: historial })
  } catch (error) {
    next(error)
  }
}

export const deleteHistorialPrecio = async (req, res, next) => {
  try {
    const { id } = req.params
    const historial = await HistorialPrecio.findByPk(id)
    if (!historial || historial.is_delete) {
      return res.status(404).json({ success: false, message: "HistorialPrecio not found" })
    }
    await historial.update({ is_delete: true })
    return res.status(200).json({ success: true, message: "HistorialPrecio deleted successfully" })
  } catch (error) {
    next(error)
  }
}