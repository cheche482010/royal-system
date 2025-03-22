// controllers/MetodoPagoController.js
import { MetodoPago } from "../models/index.js"
import { Op } from "sequelize"

export const getAllMetodosPago = async (req, res, next) => {
  try {
    const metodos = await MetodoPago.findAll({
      where: { is_delete: false },
      include: [{ model: req.models.Pago, as: 'pagos' }]
    })
    return res.status(200).json({ success: true, data: metodos })
  } catch (error) {
    next(error)
  }
}

export const getMetodoPagoById = async (req, res, next) => {
  try {
    const { id } = req.params
    const metodo = await MetodoPago.findByPk(id, {
      where: { is_delete: false },
      include: [{ model: req.models.Pago, as: 'pagos' }]
    })
    if (!metodo) {
      return res.status(404).json({ success: false, message: "MetodoPago not found" })
    }
    return res.status(200).json({ success: true, data: metodo })
  } catch (error) {
    next(error)
  }
}

export const createMetodoPago = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body
    const existingMetodo = await MetodoPago.findOne({
      where: {
        nombre,
        is_delete: false
      }
    })
    if (existingMetodo) {
      return res.status(400).json({
        success: false,
        message: "Payment method with this name already exists"
      })
    }
    const metodo = await MetodoPago.create({
      nombre,
      descripcion,
      is_active: true,
      is_delete: false
    })
    return res.status(201).json({ success: true, data: metodo })
  } catch (error) {
    next(error)
  }
}

export const updateMetodoPago = async (req, res, next) => {
  try {
    const { id } = req.params
    const { nombre, descripcion } = req.body
    const metodo = await MetodoPago.findByPk(id)
    if (!metodo || metodo.is_delete) {
      return res.status(404).json({ success: false, message: "MetodoPago not found" })
    }
    const existingMetodo = await MetodoPago.findOne({
      where: {
        nombre,
        id: { [Op.ne]: id },
        is_delete: false
      }
    })
    if (existingMetodo) {
      return res.status(400).json({
        success: false,
        message: "Payment method with this name already exists"
      })
    }
    await metodo.update({
      nombre: nombre || metodo.nombre,
      descripcion: descripcion || metodo.descripcion
    })
    return res.status(200).json({ success: true, data: metodo })
  } catch (error) {
    next(error)
  }
}

export const deleteMetodoPago = async (req, res, next) => {
  try {
    const { id } = req.params
    const metodo = await MetodoPago.findByPk(id)
    if (!metodo || metodo.is_delete) {
      return res.status(404).json({ success: false, message: "MetodoPago not found" })
    }
    await metodo.update({ is_delete: true })
    return res.status(200).json({ success: true, message: "MetodoPago deleted successfully" })
  } catch (error) {
    next(error)
  }
}