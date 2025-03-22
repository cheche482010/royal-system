// controllers/FacturaController.js
import { Factura } from "../models/index.js"
import { Op } from "sequelize"

export const getAllFacturas = async (req, res, next) => {
  try {
    const facturas = await Factura.findAll({
      where: { is_delete: false },
      include: [{ model: req.models.Orden, as: 'orden' }]
    })
    return res.status(200).json({ success: true, data: facturas })
  } catch (error) {
    next(error)
  }
}

export const getFacturaById = async (req, res, next) => {
  try {
    const { id } = req.params
    const factura = await Factura.findByPk(id, {
      where: { is_delete: false },
      include: [{ model: req.models.Orden, as: 'orden' }]
    })
    if (!factura) {
      return res.status(404).json({ success: false, message: "Factura not found" })
    }
    return res.status(200).json({ success: true, data: factura })
  } catch (error) {
    next(error)
  }
}

export const createFactura = async (req, res, next) => {
  try {
    const { orden_id, numero_factura, fecha_emision, subtotal, status_factura } = req.body
    const existingFactura = await Factura.findOne({
      where: {
        numero_factura,
        is_delete: false
      }
    })
    if (existingFactura) {
      return res.status(400).json({
        success: false,
        message: "Invoice with this number already exists"
      })
    }
    const factura = await Factura.create({
      orden_id,
      numero_factura,
      fecha_emision,
      subtotal,
      status_factura,
      is_active: true,
      is_delete: false
    })
    return res.status(201).json({ success: true, data: factura })
  } catch (error) {
    next(error)
  }
}

export const updateFactura = async (req, res, next) => {
  try {
    const { id } = req.params
    const { numero_factura, fecha_emision, subtotal, status_factura } = req.body
    const factura = await Factura.findByPk(id)
    if (!factura || factura.is_delete) {
      return res.status(404).json({ success: false, message: "Factura not found" })
    }
    const existingFactura = await Factura.findOne({
      where: {
        numero_factura,
        id: { [Op.ne]: id },
        is_delete: false
      }
    })
    if (existingFactura) {
      return res.status(400).json({
        success: false,
        message: "Invoice with this number already exists"
      })
    }
    await factura.update({
      numero_factura: numero_factura || factura.numero_factura,
      fecha_emision: fecha_emision || factura.fecha_emision,
      subtotal: subtotal || factura.subtotal,
      status_factura: status_factura || factura.status_factura
    })
    return res.status(200).json({ success: true, data: factura })
  } catch (error) {
    next(error)
  }
}

export const deleteFactura = async (req, res, next) => {
  try {
    const { id } = req.params
    const factura = await Factura.findByPk(id)
    if (!factura || factura.is_delete) {
      return res.status(404).json({ success: false, message: "Factura not found" })
    }
    await factura.update({ is_delete: true })
    return res.status(200).json({ success: true, message: "Factura deleted successfully" })
  } catch (error) {
    next(error)
  }
}