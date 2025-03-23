import { Inventario, Producto } from "../models/index.js"
import { sequelize } from "../config/database.js"
import { Op } from "sequelize"

// Obtener todo el inventario
export const getAllInventario = async (req, res, next) => {
  try {
    const inventario = await Inventario.findAll({
      where: { is_delete: false },
      include: [
        {
          model: Producto,
          attributes: ["id", "codigo", "nombre"],
        },
      ],
      order: [["fecha_ingreso", "DESC"]],
    })

    return res.status(200).json({ success: true, data: inventario })
  } catch (error) {
    next(error)
  }
}

// Obtener inventario por ID
export const getInventarioById = async (req, res, next) => {
  try {
    const { id } = req.params

    const inventario = await Inventario.findOne({
      where: { id, is_delete: false },
      include: [
        {
          model: Producto,
          attributes: ["id", "codigo", "nombre", "descripcion"],
        },
      ],
    })

    if (!inventario) {
      return res.status(404).json({ success: false, message: "Inventario not found" })
    }

    return res.status(200).json({ success: true, data: inventario })
  } catch (error) {
    next(error)
  }
}

// Crear un nuevo registro de inventario
export const createInventario = async (req, res, next) => {
  try {
    const { cantidad_inicial, lote, estado, fecha_ingreso } = req.body

    const inventario = await Inventario.create({
      cantidad_inicial,
      cantidad_actual: cantidad_inicial,
      lote,
      estado: estado || "Disponible",
      fecha_ingreso: fecha_ingreso || new Date(),
    })

    return res.status(201).json({ success: true, data: inventario })
  } catch (error) {
    next(error)
  }
}

// Actualizar inventario
export const updateInventario = async (req, res, next) => {
  try {
    const { id } = req.params
    const { cantidad_actual, estado, is_active } = req.body

    const inventario = await Inventario.findOne({
      where: { id, is_delete: false },
    })

    if (!inventario) {
      return res.status(404).json({ success: false, message: "Inventario not found" })
    }

    await inventario.update({
      cantidad_actual: cantidad_actual !== undefined ? cantidad_actual : inventario.cantidad_actual,
      estado: estado || inventario.estado,
      is_active: is_active !== undefined ? is_active : inventario.is_active,
    })

    return res.status(200).json({ success: true, data: inventario })
  } catch (error) {
    next(error)
  }
}

// Eliminar inventario (soft delete)
export const deleteInventario = async (req, res, next) => {
  try {
    const { id } = req.params

    const inventario = await Inventario.findOne({
      where: { id, is_delete: false },
    })

    if (!inventario) {
      return res.status(404).json({ success: false, message: "Inventario not found" })
    }

    // Verificar si hay productos asociados a este inventario
    const producto = await Producto.findOne({
      where: { inventario_id: id, is_delete: false },
    })

    if (producto) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete inventory with associated products",
      })
    }

    await inventario.update({ is_delete: true, is_active: false })

    return res.status(200).json({ success: true, message: "Inventario deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Obtener inventario con bajo stock
export const getLowStock = async (req, res, next) => {
  try {
    const { threshold = 10 } = req.query

    const inventario = await Inventario.findAll({
      where: {
        cantidad_actual: { [Op.lt]: threshold },
        is_delete: false,
        is_active: true,
      },
      include: [
        {
          model: Producto,
          attributes: ["id", "codigo", "nombre"],
        },
      ],
      order: [["cantidad_actual", "ASC"]],
    })

    return res.status(200).json({ success: true, data: inventario })
  } catch (error) {
    next(error)
  }
}