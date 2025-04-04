import { Coupon } from "../models/index.js"
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
    const { codigo, fecha_inicio, fecha_fin } = req.body

    // Verificar si ya existe un cupón con el mismo código
    const existingCoupon = await Coupon.findOne({
      where: { codigo, is_active: true },
    })

    if (existingCoupon) {
      return res.status(400).json({ success: false, message: "Coupon code already exists" })
    }

    const coupon = await Coupon.create({
      codigo,
      fecha_inicio,
      fecha_fin,
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
    const { codigo, fecha_inicio, fecha_fin, is_active } = req.body

    const coupon = await Coupon.findByPk(id)

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" })
    }

    // Verificar si ya existe otro cupón con el mismo código
    if (codigo && codigo !== coupon.codigo) {
      const existingCoupon = await Coupon.findOne({
        where: { codigo, is_active: true, id: { [Op.ne]: id } },
      })

      if (existingCoupon) {
        return res.status(400).json({ success: false, message: "Coupon code already exists" })
      }
    }

    await coupon.update({
      codigo: codigo || coupon.codigo,
      fecha_inicio: fecha_inicio || coupon.fecha_inicio,
      fecha_fin: fecha_fin !== undefined ? fecha_fin : coupon.fecha_fin,
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

// Validar si un cupón es válido
export const validateCoupon = async (req, res, next) => {
  try {
    const { codigo } = req.body

    const coupon = await Coupon.findOne({
      where: {
        codigo,
        is_active: true,
        fecha_inicio: { [Op.lte]: new Date() },
        [Op.or]: [{ fecha_fin: null }, { fecha_fin: { [Op.gte]: new Date() } }],
      },
    })

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid or expired coupon" })
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

