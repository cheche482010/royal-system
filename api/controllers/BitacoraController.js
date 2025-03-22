// controllers/BitacoraController.js
import { Bitacora } from "../models/index.js"
import { Op } from "sequelize"

export const getAllBitacoras = async (req, res, next) => {
  try {
    const bitacoras = await Bitacora.findAll({
      where: { is_delete: false },
      include: [{ model: req.models.Usuario, as: 'usuario' }]
    })
    return res.status(200).json({ success: true, data: bitacoras })
  } catch (error) {
    next(error)
  }
}

export const getBitacoraById = async (req, res, next) => {
  try {
    const { id } = req.params
    const bitacora = await Bitacora.findByPk(id, {
      where: { is_delete: false },
      include: [{ model: req.models.Usuario, as: 'usuario' }]
    })
    if (!bitacora) {
      return res.status(404).json({ success: false, message: "Bitacora not found" })
    }
    return res.status(200).json({ success: true, data: bitacora })
  } catch (error) {
    next(error)
  }
}

export const createBitacora = async (req, res, next) => {
  try {
    const { usuario_id, fecha, hora, accion } = req.body
    const existingBitacora = await Bitacora.findOne({
      where: {
        usuario_id,
        fecha,
        hora,
        accion,
        is_delete: false
      }
    })
    if (existingBitacora) {
      return res.status(400).json({
        success: false,
        message: "This action is already registered in the log"
      })
    }
    const bitacora = await Bitacora.create({
      usuario_id,
      fecha,
      hora,
      accion,
      is_active: true,
      is_delete: false
    })
    return res.status(201).json({ success: true, data: bitacora })
  } catch (error) {
    next(error)
  }
}

export const updateBitacora = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fecha, hora, accion } = req.body
    const bitacora = await Bitacora.findByPk(id)
    if (!bitacora || bitacora.is_delete) {
      return res.status(404).json({ success: false, message: "Bitacora not found" })
    }
    await bitacora.update({
      fecha: fecha || bitacora.fecha,
      hora: hora || bitacora.hora,
      accion: accion || bitacora.accion
    })
    return res.status(200).json({ success: true, data: bitacora })
  } catch (error) {
    next(error)
  }
}

export const deleteBitacora = async (req, res, next) => {
  try {
    const { id } = req.params
    const bitacora = await Bitacora.findByPk(id)
    if (!bitacora || bitacora.is_delete) {
      return res.status(404).json({ success: false, message: "Bitacora not found" })
    }
    await bitacora.update({ is_delete: true })
    return res.status(200).json({ success: true, message: "Bitacora deleted successfully" })
  } catch (error) {
    next(error)
  }
}