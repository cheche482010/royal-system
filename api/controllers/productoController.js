import { Producto } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Get all productos
export const getAllProductos = async (req, res, next) => {
  try {
    // Using raw SQL query with Sequelize
    const [productos] = await sequelize.query("SELECT * FROM producto WHERE is_delete = false", {
      type: sequelize.QueryTypes.SELECT,
    })

    return res.status(200).json({ success: true, data: productos })
  } catch (error) {
    next(error)
  }
}

// Get producto by ID
export const getProductoById = async (req, res, next) => {
  try {
    const { id } = req.params

    // Using raw SQL query with parameterized query to prevent SQL injection
    const [producto] = await sequelize.query("SELECT * FROM producto WHERE id = ? AND is_delete = false", {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    })

    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto not found" })
    }

    return res.status(200).json({ success: true, data: producto })
  } catch (error) {
    next(error)
  }
}

// Create a new producto
export const createProducto = async (req, res, next) => {
  try {
    const { codigo, nombre, descripcion, presentacion, cantidad } = req.body

    // Check if producto with same codigo already exists
    const existingProducto = await Producto.findOne({
      where: {
        codigo,
        is_delete: false,
      },
    })

    if (existingProducto) {
      return res.status(400).json({
        success: false,
        message: "Producto with this code already exists",
      })
    }

    // Using ORM method for creation
    const producto = await Producto.create({
      codigo,
      nombre,
      descripcion,
      presentacion,
      cantidad: cantidad || 0,
    })

    return res.status(201).json({
      success: true,
      data: producto,
    })
  } catch (error) {
    next(error)
  }
}

// Update producto
export const updateProducto = async (req, res, next) => {
  try {
    const { id } = req.params
    const { codigo, nombre, descripcion, presentacion, cantidad } = req.body

    const producto = await Producto.findByPk(id)

    if (!producto || producto.is_delete) {
      return res.status(404).json({ success: false, message: "Producto not found" })
    }

    // Check if updating to an existing codigo
    if (codigo && codigo !== producto.codigo) {
      const existingProducto = await Producto.findOne({
        where: {
          codigo,
          id: { [sequelize.Op.ne]: id },
          is_delete: false,
        },
      })

      if (existingProducto) {
        return res.status(400).json({
          success: false,
          message: "Another producto with this code already exists",
        })
      }
    }

    // Using ORM method for update
    await producto.update({
      codigo: codigo || producto.codigo,
      nombre: nombre || producto.nombre,
      descripcion: descripcion || producto.descripcion,
      presentacion: presentacion || producto.presentacion,
      cantidad: cantidad !== undefined ? cantidad : producto.cantidad,
    })

    return res.status(200).json({
      success: true,
      data: producto,
    })
  } catch (error) {
    next(error)
  }
}

// Soft delete producto
export const deleteProducto = async (req, res, next) => {
  try {
    const { id } = req.params

    const producto = await Producto.findByPk(id)

    if (!producto || producto.is_delete) {
      return res.status(404).json({ success: false, message: "Producto not found" })
    }

    // Soft delete by setting is_delete to true
    await producto.update({ is_delete: true })

    return res.status(200).json({ success: true, message: "Producto deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Hard delete producto (for admin use only)
export const hardDeleteProducto = async (req, res, next) => {
  try {
    const { id } = req.params

    const producto = await Producto.findByPk(id)

    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto not found" })
    }

    // Using raw SQL query with parameterized query to prevent SQL injection
    await sequelize.query("DELETE FROM producto WHERE id = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
    })

    return res.status(200).json({ success: true, message: "Producto permanently deleted" })
  } catch (error) {
    next(error)
  }
}

