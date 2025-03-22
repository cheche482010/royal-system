// controllers/PagoController.js
import { Pago } from "../models/index.js"
import { Op } from "sequelize"

export const getAllPagos = async (req, res, next) => {
  try {
    const pagos = await Pago.findAll({
      where: { is_delete: false },
      include: [
        { model: req.models.Orden, as: 'orden' },
        { model: req.models.MetodoPago, as: 'metodo_pago' }
      ]
    })
    return res.status(200).json({ success: true, data: pagos })
  } catch (error) {
    next(error)
  }
}

export const getPagoById = async (req, res, next) => {
  try {
    const { id } = req.params
    const pago = await Pago.findByPk(id, {
      where: { is_delete: false },
      include: [
        { model: req.models.Orden, as: 'orden' },
        { model: req.models.MetodoPago, as: 'metodo_pago' }
      ]
    })
    if (!pago) {
      return res.status(404).json({ success: false, message: "Pago not found" })
    }
    return res.status(200).json({ success: true, data: pago })
  } catch (error) {
    next(error)
  }
}

export const createPago = async (req, res, next) => {
  try {
    const { orden_id, metodo_pago_id, fecha, comprobante_img, numero_referencia, monto } = req.body
    const existingPago = await Pago.findOne({
      where: {
        orden_id,
        numero_referencia,
        is_delete: false
      }
    })
    if (existingPago) {
      return res.status(400).json({
        success: false,
        message: "Payment for this order already exists"
      })
    }
    const pago = await Pago.create({
      orden_id,
      metodo_pago_id,
      fecha,
      comprobante_img,
      numero_referencia,
      monto,
      is_active: true,
      is_delete: false
    })
    return res.status(201).json({ success: true, data: pago })
  } catch (error) {
    next(error)
  }
}

export const updatePago = async (req, res, next) => {
  try {
    const { id } = req.params
    const { fecha, comprobante_img, numero_referencia, monto } = req.body
    const pago = await Pago.findByPk(id)
    if (!pago || pago.is_delete) {
      return res.status(404).json({ success: false, message: "Pago not found" })
    }
    const existingPago = await Pago.findOne({
      where: {
        numero_referencia,
        id: { [Op.ne]: id },
        is_delete: false
      }
    })
    if (existingPago) {
      return res.status(400).json({
        success: false,
        message: "Payment with this reference number already exists"
      })
    }
    await pago.update({
      fecha: fecha || pago.fecha,
      comprobante_img: comprobante_img || pago.comprobante_img,
      numero_referencia: numero_referencia || pago.numero_referencia,
      monto: monto || pago.monto
    })
    return res.status(200).json({ success: true, data: pago })
  } catch (error) {
    next(error)
  }
}

export const deletePago = async (req, res, next) => {
  try {
    const { id } = req.params
    const pago = await Pago.findByPk(id)
    if (!pago || pago.is_delete) {
      return res.status(404).json({ success: false, message: "Pago not found" })
    }
    await pago.update({ is_delete: true })
    return res.status(200).json({ success: true, message: "Pago deleted successfully" })
  } catch (error) {
    next(error)
  }
}