import { PrecioUsuario, Usuario, Precio } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Get all precio_usuario relationships
export const getAllPrecioUsuarios = async (req, res, next) => {
  try {
    // Using Sequelize ORM with associations
    const precioUsuarios = await PrecioUsuario.findAll({
      where: { is_delete: false },
      include: [
        { model: Usuario, attributes: ["id", "nombre", "rif_cedula"] },
        { model: Precio, attributes: ["id", "nombre_precio", "precio_unidad"] },
      ],
    })

    return res.status(200).json({ success: true, data: precioUsuarios })
  } catch (error) {
    next(error)
  }
}

// Get precio_usuario by ID
export const getPrecioUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params

    // Using Sequelize ORM with associations
    const precioUsuario = await PrecioUsuario.findOne({
      where: {
        id,
        is_delete: false,
      },
      include: [
        { model: Usuario, attributes: ["id", "nombre", "rif_cedula"] },
        { model: Precio, attributes: ["id", "nombre_precio", "precio_unidad"] },
      ],
    })

    if (!precioUsuario) {
      return res.status(404).json({ success: false, message: "Precio-Usuario relationship not found" })
    }

    return res.status(200).json({ success: true, data: precioUsuario })
  } catch (error) {
    next(error)
  }
}

// Get precio_usuario by usuario_id
export const getPrecioUsuarioByUsuarioId = async (req, res, next) => {
  try {
    const { usuario_id } = req.params

    // Using Sequelize ORM with associations
    const precioUsuarios = await PrecioUsuario.findAll({
      where: {
        usuario_id,
        is_delete: false,
      },
      include: [
        { model: Usuario, attributes: ["id", "nombre", "rif_cedula"] },
        { model: Precio, attributes: ["id", "nombre_precio", "precio_unidad"] },
      ],
    })

    return res.status(200).json({ success: true, data: precioUsuarios })
  } catch (error) {
    next(error)
  }
}

// Create a new precio_usuario relationship
export const createPrecioUsuario = async (req, res, next) => {
  try {
    const { usuario_id, precio_id } = req.body

    // Check if both usuario and precio exist
    const usuario = await Usuario.findByPk(usuario_id)
    const precio = await Precio.findByPk(precio_id)

    if (!usuario || usuario.is_delete) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    if (!precio || precio.is_delete) {
      return res.status(404).json({ success: false, message: "Precio not found" })
    }

    // Check if relationship already exists
    const existingRelationship = await PrecioUsuario.findOne({
      where: {
        usuario_id,
        precio_id,
        is_delete: false,
      },
    })

    if (existingRelationship) {
      return res.status(400).json({
        success: false,
        message: "This Usuario-Precio relationship already exists",
      })
    }

    // Using ORM method for creation
    const precioUsuario = await PrecioUsuario.create({
      usuario_id,
      precio_id,
    })

    // Fetch the created relationship with associations
    const result = await PrecioUsuario.findByPk(precioUsuario.id, {
      include: [
        { model: Usuario, attributes: ["id", "nombre", "rif_cedula"] },
        { model: Precio, attributes: ["id", "nombre_precio", "precio_unidad"] },
      ],
    })

    return res.status(201).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

// Update precio_usuario relationship
export const updatePrecioUsuario = async (req, res, next) => {
  try {
    const { id } = req.params
    const { usuario_id, precio_id } = req.body

    const precioUsuario = await PrecioUsuario.findByPk(id)

    if (!precioUsuario || precioUsuario.is_delete) {
      return res.status(404).json({ success: false, message: "Precio-Usuario relationship not found" })
    }

    // If updating either ID, check if the new entities exist
    if (usuario_id) {
      const usuario = await Usuario.findByPk(usuario_id)
      if (!usuario || usuario.is_delete) {
        return res.status(404).json({ success: false, message: "Usuario not found" })
      }
    }

    if (precio_id) {
      const precio = await Precio.findByPk(precio_id)
      if (!precio || precio.is_delete) {
        return res.status(404).json({ success: false, message: "Precio not found" })
      }
    }

    // Check if the new relationship would be a duplicate
    if (usuario_id || precio_id) {
      const newUsuarioId = usuario_id || precioUsuario.usuario_id
      const newPrecioId = precio_id || precioUsuario.precio_id

      const existingRelationship = await PrecioUsuario.findOne({
        where: {
          usuario_id: newUsuarioId,
          precio_id: newPrecioId,
          id: { [sequelize.Op.ne]: id },
          is_delete: false,
        },
      })

      if (existingRelationship) {
        return res.status(400).json({
          success: false,
          message: "This Usuario-Precio relationship already exists",
        })
      }
    }

    // Using ORM method for update
    await precioUsuario.update({
      usuario_id: usuario_id || precioUsuario.usuario_id,
      precio_id: precio_id || precioUsuario.precio_id,
    })

    // Fetch the updated relationship with associations
    const result = await PrecioUsuario.findByPk(precioUsuario.id, {
      include: [
        { model: Usuario, attributes: ["id", "nombre", "rif_cedula"] },
        { model: Precio, attributes: ["id", "nombre_precio", "precio_unidad"] },
      ],
    })

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

// Soft delete precio_usuario relationship
export const deletePrecioUsuario = async (req, res, next) => {
  try {
    const { id } = req.params

    const precioUsuario = await PrecioUsuario.findByPk(id)

    if (!precioUsuario || precioUsuario.is_delete) {
      return res.status(404).json({ success: false, message: "Precio-Usuario relationship not found" })
    }

    // Soft delete by setting is_delete to true
    await precioUsuario.update({ is_delete: true })

    return res.status(200).json({ success: true, message: "Precio-Usuario relationship deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Hard delete precio_usuario relationship (for admin use only)
export const hardDeletePrecioUsuario = async (req, res, next) => {
  try {
    const { id } = req.params

    const precioUsuario = await PrecioUsuario.findByPk(id)

    if (!precioUsuario) {
      return res.status(404).json({ success: false, message: "Precio-Usuario relationship not found" })
    }

    // Using raw SQL query with parameterized query to prevent SQL injection
    await sequelize.query("DELETE FROM precio_usuario WHERE id = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
    })

    return res.status(200).json({ success: true, message: "Precio-Usuario relationship permanently deleted" })
  } catch (error) {
    next(error)
  }
}

