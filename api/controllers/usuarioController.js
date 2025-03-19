import { Usuario } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Get all usuarios
export const getAllUsuarios = async (req, res, next) => {
  try {
    // Using raw SQL query with Sequelize
    const usuarios = await sequelize.query("SELECT * FROM usuarios WHERE is_delete = false", {
      type: sequelize.QueryTypes.SELECT,
    })

    return res.status(200).json({ success: true, data: usuarios })
  } catch (error) {
    next(error)
  }
}

// Get usuario by ID
export const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params

    // Using raw SQL query with parameterized query to prevent SQL injection
    const [usuario] = await sequelize.query("SELECT * FROM usuarios WHERE id = ? AND is_delete = false", {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    })

    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    return res.status(200).json({ success: true, data: usuario })
  } catch (error) {
    next(error)
  }
}

// Create a new usuario
export const createUsuario = async (req, res, next) => {
  try {
    const { rif_cedula, nombre, direccion, registro_mercantil, volumen_compra, correo, telefono } = req.body

    // Check if usuario with same rif_cedula or correo already exists
    const existingUsuario = await Usuario.findOne({
      where: {
        [sequelize.Op.or]: [{ rif_cedula }, { correo }],
        is_delete: false,
      },
    })

    if (existingUsuario) {
      return res.status(400).json({
        success: false,
        message: "Usuario with this RIF/Cédula or email already exists",
      })
    }

    // Using ORM method for creation
    const usuario = await Usuario.create({
      rif_cedula,
      nombre,
      direccion,
      registro_mercantil,
      volumen_compra,
      correo,
      telefono,
    })

    return res.status(201).json({
      success: true,
      data: usuario,
    })
  } catch (error) {
    next(error)
  }
}

// Update usuario
export const updateUsuario = async (req, res, next) => {
  try {
    const { id } = req.params
    const { rif_cedula, nombre, direccion, registro_mercantil, volumen_compra, correo, telefono } = req.body

    const usuario = await Usuario.findByPk(id)

    if (!usuario || usuario.is_delete) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    // Check if updating to an existing rif_cedula or correo
    if (rif_cedula || correo) {
      const existingUsuario = await Usuario.findOne({
        where: {
          id: { [sequelize.Op.ne]: id },
          [sequelize.Op.or]: [rif_cedula ? { rif_cedula } : null, correo ? { correo } : null].filter(Boolean),
          is_delete: false,
        },
      })

      if (existingUsuario) {
        return res.status(400).json({
          success: false,
          message: "Another usuario with this RIF/Cédula or email already exists",
        })
      }
    }

    // Using ORM method for update
    await usuario.update({
      rif_cedula: rif_cedula || usuario.rif_cedula,
      nombre: nombre || usuario.nombre,
      direccion: direccion || usuario.direccion,
      registro_mercantil: registro_mercantil || usuario.registro_mercantil,
      volumen_compra: volumen_compra || usuario.volumen_compra,
      correo: correo || usuario.correo,
      telefono: telefono || usuario.telefono,
    })

    return res.status(200).json({
      success: true,
      data: usuario,
    })
  } catch (error) {
    next(error)
  }
}

// Soft delete usuario
export const deleteUsuario = async (req, res, next) => {
  try {
    const { id } = req.params

    const usuario = await Usuario.findByPk(id)

    if (!usuario || usuario.is_delete) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    // Soft delete by setting is_delete to true
    await usuario.update({ is_delete: true })

    return res.status(200).json({ success: true, message: "Usuario deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Hard delete usuario (for admin use only)
export const hardDeleteUsuario = async (req, res, next) => {
  try {
    const { id } = req.params

    const usuario = await Usuario.findByPk(id)

    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    // Using raw SQL query with parameterized query to prevent SQL injection
    await sequelize.query("DELETE FROM usuarios WHERE id = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
    })

    return res.status(200).json({ success: true, message: "Usuario permanently deleted" })
  } catch (error) {
    next(error)
  }
}

