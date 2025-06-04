import { CouponUsado, Coupon, Usuario, Orden } from "../models/index.js"
import { Op } from "sequelize"

// Obtener todos los usos de cupones
export const getAllCouponsUsed = async (req, res, next) => {
  try {
    const couponsUsed = await CouponUsado.findAll({
      include: [
        { 
          model: Coupon,
          attributes: ['id', 'codigo', 'descuento', 'tipo_descuento'],
          where: { is_active: true } 
        },
        { 
          model: Usuario,
          attributes: ['id', 'nombre', 'correo']
        },
        { 
          model: Orden,
          attributes: ['id', 'monto_total', 'status']
        }
      ],
      order: [['fecha_uso', 'DESC']]
    })

    if (!couponsUsed || couponsUsed.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No se encontraron cupones usados" 
      })
    }

    return res.status(200).json({ success: true, data: couponsUsed })
  } catch (error) {
    next(error)
  }
}

// Obtener los cupones usados por un usuario
export const getCouponsUsedByUser = async (req, res, next) => {
  try {
    const { usuario_id } = req.params

    const couponsUsed = await CouponUsado.findAll({
      where: { usuario_id },
      include: [
        { model: Coupon, attributes: ['codigo', 'descuento', 'tipo_descuento'] },
        { model: Orden, attributes: ['id', 'monto_total'] }
      ],
      order: [['fecha_uso', 'DESC']]
    })

    return res.status(200).json({ success: true, data: couponsUsed })
  } catch (error) {
    next(error)
  }
}

// Obtener los usos de un cupón específico
export const getCouponUsage = async (req, res, next) => {
  try {
    const { cupon_id } = req.params

    const couponUsage = await CouponUsado.findAll({
      where: { cupon_id },
      include: [
        { model: Usuario, attributes: ['nombre', 'correo'] },
        { model: Orden, attributes: ['id', 'monto_total'] }
      ],
      order: [['fecha_uso', 'DESC']]
    })

    return res.status(200).json({ success: true, data: couponUsage })
  } catch (error) {
    next(error)
  }
}