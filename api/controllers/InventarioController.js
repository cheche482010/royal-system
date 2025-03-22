// controllers/InventarioController.js
import { Inventario } from "../models/index.js"
import { Op } from "sequelize"

export const getAllInventarios = async (req, res, next) => {
  try {
    const inventarios = await Inventario.findAll({
      where: { is_delete: false },
      include: [{ model: req.models.Producto, as: 'producto' }]
    })
    return res.status(200).json({ success: true, data: inventarios })
  } catch (error) {
    next(error)
  }
}

export const getInventarioById = async (req, res, next) => {
  try {
    const { id } = req.params
    const inventario = await Inventario.findByPk(id, {
      where: { is_delete: false },
      include: [{ model: req.models.Producto, as: 'producto' }]
    })
    if (!inventario) {
      return res.status(404).json({ success: false, message: "Inventario not found" })
    }
    return res.status(200).json({ success: true, data: inventario })
  } catch (error) {
    next(error)
  }
}

export const createInventario = async (req, res, next) => {
  try {
    const { producto_id, cantidad_inicial, cantidad_actual, lote, estado } = req.body
    const existingInventario = await Inventario.findOne({
      where: {
        producto_id,
        is_delete: false
      }
    })
    if (existingInventario) {
      return res.status(400).json({
        success: false,
        message: "Inventory for this product already exists"
      })
    }
    const inventario = await Inventario.create({
      producto_id,
      cantidad_inicial,
      cantidad_actual,
      lote,
      estado,
      is_active: true,
      is_delete: false
    })
    return res.status(201).json({ success: true, data: inventario })
  } catch (error) {
    next(error)
  }
}

export const updateInventario = async (req, res, next) => {
  try {
    const { id } = req.params
    const { cantidad_inicial, cantidad_actual, lote, estado } = req.body
    const inventario = await Inventario.findByPk(id)
    if (!inventario || inventario.is_delete) {
      return res.status(404).json({ success: false, message: "Inventario not found" })
    }
    await inventario.update({
      cantidad_inicial: cantidad_inicial || inventario.cantidad_inicial,
      cantidad_actual: cantidad_actual || inventario.cantidad_actual,
      lote: lote || inventario.lote,
      estado: estado || inventario.estado
    })
    return res.status(200).json({ success: true, data: inventario })
  } catch (error) {
    next(error)
  }
}

export const deleteInventario = async (req, res, next) => {
  try {
    const { id } = req.params
    const inventario = await Inventario.findByPk(id)
    if (!inventario || inventario.is_delete) {
      return res.status(404).json({ success: false, message: "Inventario not found" })
    }
    await inventario.update({ is_delete: true })
    return res.status(200).json({ success: true, message: "Inventario deleted successfully" })
  } catch (error) {
    next(error)
  }
}