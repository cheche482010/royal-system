// controllers/SesionController.js
import { Sesion } from "../models/index.js"
import { Op } from "sequelize"

export const getAllSesiones = async (req, res, next) => {
  try {
    const sesiones = await Sesion.findAll({
      where: { is_active: true },
      include: [{ model: req.models.Usuario, as: 'usuario' }]
    })
    return res.status(200).json({ success: true, data: sesiones })
  } catch (error) {
    next(error)
  }
}

export const getSesionById = async (req, res, next) => {
  try {
    const { id } = req.params
    const sesion = await Sesion.findByPk(id, {
      where: { is_active: true },
      include: [{ model: req.models.Usuario, as: 'usuario' }]
    })
    if (!sesion) {
      return res.status(404).json({ success: false, message: "Sesion not found" })
    }
    return res.status(200).json({ success: true, data: sesion })
  } catch (error) {
    next(error)
  }
}

export const createSesion = async (req, res, next) => {
  try {
    const { usuario_id, token, ip, expiracion, agente_usuario } = req.body
    const existingSesion = await Sesion.findOne({
      where: {
        usuario_id,
        token,
        is_active: true
      }
    })
    if (existingSesion) {
      return res.status(400).json({
        success: false,
        message: "Session already exists"
      })
    }
    const sesion = await Sesion.create({
      usuario_id,
      token,
      ip,
      expiracion,
      agente_usuario,
      is_active: true
    })
    return res.status(201).json({ success: true, data: sesion })
  } catch (error) {
    next(error)
  }
}

export const updateSesion = async (req, res, next) => {
  try {
    const { id } = req.params
    const { ip, expiracion, agente_usuario } = req.body
    const sesion = await Sesion.findByPk(id)
    if (!sesion || !sesion.is_active) {
      return res.status(404).json({ success: false, message: "Sesion not found" })
    }
    await sesion.update({
      ip: ip || sesion.ip,
      expiracion: expiracion || sesion.expiracion,
      agente_usuario: agente_usuario || sesion.agente_usuario
    })
    return res.status(200).json({ success: true, data: sesion })
  } catch (error) {
    next(error)
  }
}

export const deleteSesion = async (req, res, next) => {
  try {
    const { id } = req.params
    const sesion = await Sesion.findByPk(id)
    if (!sesion || !sesion.is_active) {
      return res.status(404).json({ success: false, message: "Sesion not found" })
    }
    await sesion.update({ is_active: false })
    return res.status(200).json({ success: true, message: "Sesion deleted successfully" })
  } catch (error) {
    next(error)
  }
}