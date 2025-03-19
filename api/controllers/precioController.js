import { Precio } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Get all precios
export const getAllPrecios = async (req, res, next) => {
  try {
    // Using raw SQL query with Sequelize
    const [precios] = await sequelize.query("SELECT * FROM precio WHERE is_delete = false", {
      type: sequelize.QueryTypes.SELECT,
    })

    return res.status(200).json({ success: true, data: precios })
  } catch (error) {
    next(error)
  }
}

// Get precio by ID
export const getPrecioById = async (req, res, next) => {
  try {
    const { id } = req.params

    // Using raw SQL query with parameterized query to prevent SQL injection
    const [precio] = await sequelize.query("SELECT * FROM precio WHERE id = ? AND is_delete = false", {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    })

    if (!precio) {
      return res.status(404).json({ success: false, message: "Precio not found" })
    }

    return res.status(200).json({ success: true, data: precio })
  } catch (error) {
    next(error)
  }
}

// Create a new precio
export const createPrecio = async (req, res, next) => {
  try {
    const { codigo_precio, nombre_precio, precio_unidad } = req.body

    // Check if precio with same codigo_precio already exists
    const existingPrecio = await Precio.findOne({
      where: {
        codigo_precio,
        is_delete: false,
      },
    })

    if (existingPrecio) {
      return res.status(400).json({
        success: false,
        message: "Precio with this code already exists",
      })
    }

    // Using ORM method for creation
    const precio = await Precio.create({
      codigo_precio,
      nombre_precio,
      precio_unidad,
    })

    return res.status(201).json({
      success: true,
      data: precio,
    })
  } catch (error) {
    next(error)
  }
}

// Update precio
export const updatePrecio = async (req, res, next) => {
  try {
    const { id } = req.params
    const { codigo_precio, nombre_precio, precio_unidad } = req.body

    const precio = await Precio.findByPk(id)

    if (!precio || precio.is_delete) {
      return res.status(404).json({ success: false, message: "Precio not found" })
    }

    // Check if updating to an existing codigo_precio
    if (codigo_precio && codigo_precio !== precio.codigo_precio) {
      const existingPrecio = await Precio.findOne({
        where: {
          codigo_precio,
          id: { [sequelize.Op.ne]: id },
          is_delete: false,
        },
      })

      if (existingPrecio) {
        return res.status(400).json({
          success: false,
          message: "Another precio with this code already exists",
        })
      }
    }

    // Using ORM method for update
    await precio.update({
      codigo_precio: codigo_precio || precio.codigo_precio,
      nombre_precio: nombre_precio || precio.nombre_precio,
      precio_unidad: precio_unidad || precio.precio_unidad,
    })

    return res.status(200).json({
      success: true,
      data: precio,
    })
  } catch (error) {
    next(error)
  }
}

// Soft delete precio
export const deletePrecio = async (req, res, next) => {
  try {
    const { id } = req.params

    const precio = await Precio.findByPk(id)

    if (!precio || precio.is_delete) {
      return res.status(404).json({ success: false, message: "Precio not found" })
    }

    // Soft delete by setting is_delete to true
    await precio.update({ is_delete: true })

    return res.status(200).json({ success: true, message: "Precio deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Hard delete precio (for admin use only)
export const hardDeletePrecio = async (req, res, next) => {
  try {
    const { id } = req.params

    const precio = await Precio.findByPk(id)

    if (!precio) {
      return res.status(404).json({ success: false, message: "Precio not found" })
    }

    // Using raw SQL query with parameterized query to prevent SQL injection
    await sequelize.query("DELETE FROM precio WHERE id = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
    })

    return res.status(200).json({ success: true, message: "Precio permanently deleted" })
  } catch (error) {
    next(error)
  }
}

