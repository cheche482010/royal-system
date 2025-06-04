import { Coupon, CouponUsado, Orden } from "../models/index.js"
import { sequelize } from "../config/database.js"
import { Op } from "sequelize"

// Obtener todos los cupones
export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.findAll({
      where: { is_active: true },
    })

    return res.status(200).json({ success: true, data: coupons })
  } catch (error) {
    next(error)
  }
}

// Obtener un cupón por ID
export const getCouponById = async (req, res, next) => {
  try {
    const { id } = req.params

    const coupon = await Coupon.findOne({
      where: { id, is_active: true },
    })

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" })
    }

    return res.status(200).json({ success: true, data: coupon })
  } catch (error) {
    next(error)
  }
}

// Obtener un cupón por código
export const getCouponByCode = async (req, res, next) => {
  try {
    const { codigo } = req.params

    const coupon = await Coupon.findOne({
      where: {
        codigo,
        is_active: true,
        fecha_inicio: { [Op.lte]: new Date() },
        [Op.or]: [{ fecha_fin: null }, { fecha_fin: { [Op.gte]: new Date() } }],
        [Op.or]: [
          { max_usos: null },
          { max_usos: { [Op.gt]: sequelize.col('usos_actuales') } }
        ]
      },
    })

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found or expired" })
    }

    return res.status(200).json({ success: true, data: coupon })
  } catch (error) {
    next(error)
  }
}

// Crear un nuevo cupón
export const createCoupon = async (req, res, next) => {
  try {
    const { codigo, descuento, tipo_descuento, fecha_inicio, fecha_fin, max_usos } = req.body

    // Verificar si ya existe un cupón con el mismo código
    const existingCoupon = await Coupon.findOne({
      where: { codigo },
    })

    if (existingCoupon) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" })
    }

    const coupon = await Coupon.create({
      codigo,
      descuento,
      tipo_descuento,
      fecha_inicio,
      fecha_fin,
      max_usos,
      usos_actuales: 0,
      is_active: true
    })

    return res.status(201).json({ success: true, data: coupon })
  } catch (error) {
    next(error)
  }
}

// Actualizar un cupón
export const updateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params
    const { codigo, descuento, tipo_descuento, fecha_inicio, fecha_fin, max_usos, is_active } = req.body

    const coupon = await Coupon.findByPk(id)

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" })
    }

    // Verificar si ya existe otro cupón con el mismo código
    if (codigo && codigo !== coupon.codigo) {
      const existingCoupon = await Coupon.findOne({
        where: { codigo, id: { [Op.ne]: id } },
      })

      if (existingCoupon) {
        return res.status(400).json({ success: false, message: "Coupon code already exists" })
      }
    }

    await coupon.update({
      codigo: codigo || coupon.codigo,
      descuento: descuento || coupon.descuento,
      tipo_descuento: tipo_descuento || coupon.tipo_descuento,
      fecha_inicio: fecha_inicio || coupon.fecha_inicio,
      fecha_fin: fecha_fin !== undefined ? fecha_fin : coupon.fecha_fin,
      max_usos: max_usos !== undefined ? max_usos : coupon.max_usos,
      is_active: is_active !== undefined ? is_active : coupon.is_active,
    })

    return res.status(200).json({ success: true, data: coupon })
  } catch (error) {
    next(error)
  }
}

// Desactivar un cupón (soft delete)
export const deactivateCoupon = async (req, res, next) => {
  try {
    const { id } = req.params

    const coupon = await Coupon.findByPk(id)

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" })
    }

    await coupon.update({ is_active: false })

    return res.status(200).json({ success: true, message: "Coupon deactivated successfully" })
  } catch (error) {
    next(error)
  }
}

// Validar si un cupón es válido para un usuario específico
export const validateCoupon = async (req, res, next) => {
  try {
    const { codigo } = req.body
    const userId = req.user.id

    // Verificar si el cupón existe y está activo
    const coupon = await Coupon.findOne({
      where: {
        codigo,
        is_active: true,
        fecha_inicio: { [Op.lte]: new Date() },
        [Op.or]: [{ fecha_fin: null }, { fecha_fin: { [Op.gte]: new Date() } }],
        [Op.or]: [
          { max_usos: null },
          { max_usos: { [Op.gt]: sequelize.literal('usos_actuales') } },
        ]
      },
    })

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Cupón no válido o caducado" })
    }

    // Verificar si el usuario ya usó este cupón
    const couponUsed = await CouponUsado.findOne({
      where: {
        cupon_id: coupon.id,
        usuario_id: userId,
      },
    })

    if (couponUsed) {
      return res.status(200).json({ 
        success: false, 
        message: "Ya has utilizado este cupón" 
      })
    }

    return res.status(200).json({
      success: true,
      message: "Coupon is valid",
      data: coupon,
    })
  } catch (error) {
    next(error)
  }
}

// Aplicar un cupón a una orden
export const applyCoupon = async (req, res, next) => {
  try {
    const { codigo, orden_id } = req.body
    const userId = req.user.id

    // Verificar si la orden existe y pertenece al usuario
    const orden = await Orden.findOne({
      where: { id: orden_id, usuario_id: userId },
    })

    if (!orden) {
      return res.status(404).json({ success: false, message: "Order not found" })
    }

    // Verificar si el cupón es válido
    const coupon = await Coupon.findOne({
      where: {
        codigo,
        is_active: true,
        fecha_inicio: { [Op.lte]: new Date() },
        [Op.or]: [{ fecha_fin: null }, { fecha_fin: { [Op.gte]: new Date() } }],
        [Op.or]: [
          { max_usos: null },
          { max_usos: { [Op.gt]: sequelize.col('usos_actuales') } },
        ]
      },
    })

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Cupón no válido o caducado" })
    }

    // Verificar si el usuario ya usó este cupón
    const couponUsed = await CouponUsado.findOne({
      where: {
        cupon_id: coupon.id,
        usuario_id: userId,
      },
    })

    if (couponUsed) {
      return res.status(200).json({ 
        success: false, 
        message: "Ya has utilizado este cupón" 
      })
    }

    // Registrar el uso del cupón
    await CouponUsado.create({
      cupon_id: coupon.id,
      usuario_id: userId,
      orden_id: orden.id,
    })

    // Incrementar el contador de usos del cupón
    await coupon.increment('usos_actuales')

    // Calcular el descuento y actualizar la orden
    let descuento = 0
    if (coupon.tipo_descuento === 'porcentaje') {
      const porcentaje = parseFloat(coupon.descuento) / 100
      descuento = orden.monto_total * porcentaje
    } else {
      descuento = parseFloat(coupon.descuento.replace('$', ''))
    }

    const nuevoTotal = orden.monto_total - descuento
    await orden.update({ monto_total: nuevoTotal })

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: {
        descuento,
        nuevoTotal,
        coupon
      }
    })
  } catch (error) {
    next(error)
  }
}