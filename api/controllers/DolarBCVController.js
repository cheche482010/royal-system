// controllers/DolarBCVController.js
import { DolarBCV } from "../models/index.js"
import { Op } from "sequelize"

export const getAllDolarBCV = async (req, res, next) => {
  try {
    const tasas = await DolarBCV.findAll({
      where: { is_delete: false },
      order: [['fecha_inicio', 'DESC']]
    })
    return res.status(200).json({ success: true, data: tasas })
  } catch (error) {
    next(error)
  }
}

export const getDolarBCVById = async (req, res, next) => {
  try {
    const { id } = req.params
    const tasa = await DolarBCV.findByPk(id, {
      where: { is_delete: false }
    })
    if (!tasa) {
      return res.status(404).json({ success: false, message: "DolarBCV not found" })
    }
    return res.status(200).json({ success: true, data: tasa })
  } catch (error) {
    next(error)
  }
}

export const createDolarBCV = async (req, res, next) => {
  try {
    const { tasa_cambio, fecha_inicio, fecha_fin } = req.body
    const existingTasa = await DolarBCV.findOne({
      where: {
        fecha_inicio,
        is_delete: false
      }
    })
    if (existingTasa) {
      return res.status(400).json({
        success: false,
        message: "Exchange rate for this date already exists"
      })
    }
    const tasa = await DolarBCV.create({
      tasa_cambio,
      fecha_inicio,
      fecha_fin,
      is_active: true,
      is_delete: false
    })
    return res.status(201).json({ success: true, data: tasa })
  } catch (error) {
    next(error)
  }
}

export const updateDolarBCV = async (req, res, next) => {
  try {
    const { id } = req.params
    const { tasa_cambio, fecha_inicio, fecha_fin } = req.body
    const tasa = await DolarBCV.findByPk(id)
    if (!tasa || tasa.is_delete) {
      return res.status(404).json({ success: false, message: "DolarBCV not found" })
    }
    const existingTasa = await DolarBCV.findOne({
      where: {
        fecha_inicio,
        id: { [Op.ne]: id },
        is_delete: false
      }
    })
    if (existingTasa) {
      return res.status(400).json({
        success: false,
        message: "Exchange rate for this date already exists"
      })
    }
    await tasa.update({
      tasa_cambio: tasa_cambio || tasa.tasa_cambio,
      fecha_inicio: fecha_inicio || tasa.fecha_inicio,
      fecha_fin: fecha_fin || tasa.fecha_fin
    })
    return res.status(200).json({ success: true, data: tasa })
  } catch (error) {
    next(error)
  }
}

export const deleteDolarBCV = async (req, res, next) => {
  try {
    const { id } = req.params
    const tasa = await DolarBCV.findByPk(id)
    if (!tasa || tasa.is_delete) {
      return res.status(404).json({ success: false, message: "DolarBCV not found" })
    }
    await tasa.update({ is_delete: true })
    return res.status(200).json({ success: true, message: "DolarBCV deleted successfully" })
  } catch (error) {
    next(error)
  }
}