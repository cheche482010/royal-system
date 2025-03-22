// controllers/OrdenController.js
import { Orden } from "../models/index.js"
import { Op } from "sequelize"

export const getAllOrdenes = async (req, res, next) => {
  try {
    const ordenes = await Orden.findAll({
      where: { is_delete: false },
      include: [
        { model: req.models.Usuario, as: 'usuario' },
        { model: req.models.DetalleOrden, as: 'detalles' },
        { model: req.models.Factura, as: 'factura' },
        { model: req.models.Pago, as: 'pagos' }
      ]
    })
    return res.status(200).json({ success: true, data: ordenes })
  } catch (error) {
    next(error)
  }
}

export const getOrdenById = async (req, res, next) => {
  try {
    const { id } = req.params
    const orden = await Orden.findByPk(id, {
      where: { is_delete: false },
      include: [
        { model: req.models.Usuario, as: 'usuario' },
        { model: req.models.DetalleOrden, as: 'detalles' },
        { model: req.models.Factura, as: 'factura' },
        { model: req.models.Pago, as: 'pagos' }
      ]
    })
    if (!orden) {
      return res.status(404).json({ success: false, message: "Orden not found" })
    }
    return res.status(200).json({ success: true, data: orden })
  } catch (error) {
    next(error)
  }
}

export const createOrden = async (req, res, next) => {
  try {
    const { usuario_id, monto_total, status } = req.body
    const orden = await Orden.create({
      usuario_id,
      monto_total,
      status,
      is_active: true,
      is_delete: false
    })
    return res.status(201).json({ success: true, data: orden })
  } catch (error) {
    next(error)
  }
}

export const updateOrden = async (req, res, next) => {
  try {
    const { id } = req.params
    const { monto_total, status } = req.body
    const orden = await Orden.findByPk(id)
    if (!orden || orden.is_delete) {
      return res.status(404).json({ success: false, message: "Orden not found" })
    }
    await orden.update({
      monto_total: monto_total || orden.monto_total,
      status: status || orden.status
    })
    return res.status(200).json({ success: true, data: orden })
  } catch (error) {
    next(error)
  }
}

export const deleteOrden = async (req, res, next) => {
  try {
    const { id } = req.params
    const orden = await Orden.findByPk(id)
    if (!orden || orden.is_delete) {
      return res.status(404).json({ success: false, message: "Orden not found" })
    }
    await orden.update({ is_delete: true })
    return res.status(200).json({ success: true, message: "Orden deleted successfully" })
  } catch (error) {
    next(error)
  }
}