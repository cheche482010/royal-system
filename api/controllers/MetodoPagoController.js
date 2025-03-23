import { MetodoPago, Pago } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Obtener todos los métodos de pago
export const getAllMetodosPago = async (req, res, next) => {
  try {
    const metodosPago = await MetodoPago.findAll({
      where: { is_delete: false },
      order: [["nombre", "ASC"]],
    })

    return res.status(200).json({ success: true, data: metodosPago })
  } catch (error) {
    next(error)
  }
}

// Obtener método de pago por ID
export const getMetodoPagoById = async (req, res, next) => {
  try {
    const { id } = req.params

    const metodoPago = await MetodoPago.findOne({
      where: { id, is_delete: false },
    })

    if (!metodoPago) {
      return res.status(404).json({ success: false, message: "Método de pago not found" })
    }

    return res.status(200).json({ success: true, data: metodoPago })
  } catch (error) {
    next(error)
  }
}

// Crear un nuevo método de pago
export const createMetodoPago = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body

    const metodoPago = await MetodoPago.create({
      nombre,
      descripcion,
    })

    return res.status(201).json({ success: true, data: metodoPago })
  } catch (error) {
    next(error)
  }
}

// Actualizar método de pago
export const updateMetodoPago = async (req, res, next) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, is_active } = req.body

    const metodoPago = await MetodoPago.findOne({
      where: { id, is_delete: false },
    })

    if (!metodoPago) {
      return res.status(404).json({ success: false, message: "Método de pago not found" })
    }

    await metodoPago.update({
      nombre: nombre || metodoPago.nombre,
      descripcion: descripcion !== undefined ? descripcion : metodoPago.descripcion,
      is_active: is_active !== undefined ? is_active : metodoPago.is_active,
    })

    return res.status(200).json({ success: true, data: metodoPago })
  } catch (error) {
    next(error)
  }
}

// Eliminar método de pago (soft delete)
export const deleteMetodoPago = async (req, res, next) => {
  try {
    const { id } = req.params

    const metodoPago = await MetodoPago.findOne({
      where: { id, is_delete: false },
    })

    if (!metodoPago) {
      return res.status(404).json({ success: false, message: "Método de pago not found" })
    }

    // Verificar si hay pagos asociados a este método
    const pagosCount = await Pago.count({
      where: { metodo_pago_id: id, is_delete: false },
    })

    if (pagosCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete payment method with associated payments",
        count: pagosCount,
      })
    }

    await metodoPago.update({ is_delete: true, is_active: false })

    return res.status(200).json({ success: true, message: "Método de pago deleted successfully" })
  } catch (error) {
    next(error)
  }
}