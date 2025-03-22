// controllers/DetalleOrdenController.js
import { DetalleOrden } from "../models/index.js"
import { Op } from "sequelize"

export const getAllDetallesOrden = async (req, res, next) => {
  try {
    const detalles = await DetalleOrden.findAll({
      where: { is_delete: false },
      include: [
        { model: req.models.Orden, as: 'orden' },
        { model: req.models.Producto, as: 'producto' }
      ]
    })
    return res.status(200).json({ success: true, data: detalles })
  } catch (error) {
    next(error)
  }
}

export const getDetalleOrdenById = async (req, res, next) => {
  try {
    const { id } = req.params
    const detalle = await DetalleOrden.findByPk(id, {
      where: { is_delete: false },
      include: [
        { model: req.models.Orden, as: 'orden' },
        { model: req.models.Producto, as: 'producto' }
      ]
    })
    if (!detalle) {
      return res.status(404).json({ success: false, message: "DetalleOrden not found" })
    }
    return res.status(200).json({ success: true, data: detalle })
  } catch (error) {
    next(error)
  }
}

export const createDetalleOrden = async (req, res, next) => {
  try {
    const { orden_id, producto_id, cantidad, precio } = req.body
    const existingDetalle = await DetalleOrden.findOne({
      where: {
        orden_id,
        producto_id,
        is_delete: false
      }
    })
    if (existingDetalle) {
      return res.status(400).json({
        success: false,
        message: "Product already exists in this order"
      })
    }
    const detalle = await DetalleOrden.create({
      orden_id,
      producto_id,
      cantidad,
      precio,
      is_active: true,
      is_delete: false
    })
    return res.status(201).json({ success: true, data: detalle })
  } catch (error) {
    next(error)
  }
}

export const updateDetalleOrden = async (req, res, next) => {
  try {
    const { id } = req.params
    const { cantidad, precio } = req.body
    const detalle = await DetalleOrden.findByPk(id)
    if (!detalle || detalle.is_delete) {
      return res.status(404).json({ success: false, message: "DetalleOrden not found" })
    }
    await detalle.update({
      cantidad: cantidad || detalle.cantidad,
      precio: precio || detalle.precio
    })
    return res.status(200).json({ success: true, data: detalle })
  } catch (error) {
    next(error)
  }
}

export const deleteDetalleOrden = async (req, res, next) => {
  try {
    const { id } = req.params
    const detalle = await DetalleOrden.findByPk(id)
    if (!detalle || detalle.is_delete) {
      return res.status(404).json({ success: false, message: "DetalleOrden not found" })
    }
    await detalle.update({ is_delete: true })
    return res.status(200).json({ success: true, message: "DetalleOrden deleted successfully" })
  } catch (error) {
    next(error)
  }
}