import { Sesion, Usuario } from "../models/index.js"
import { sequelize } from "../config/database.js"
import jwt from "jsonwebtoken"

// Obtener todas las sesiones
export const getAllSesiones = async (req, res, next) => {
  try {
    const sesiones = await Sesion.findAll({
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "correo", "role"],
        },
      ],
      order: [["created_at", "DESC"]],
    })

    return res.status(200).json({ success: true, data: sesiones })
  } catch (error) {
    next(error)
  }
}

// Obtener sesiones por usuario
export const getSesionesByUsuario = async (req, res, next) => {
  try {
    const { usuario_id } = req.params

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(usuario_id)
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    const sesiones = await Sesion.findAll({
      where: { usuario_id },
      order: [["created_at", "DESC"]],
    })

    return res.status(200).json({ success: true, data: sesiones })
  } catch (error) {
    next(error)
  }
}

// Crear una nueva sesión
export const createSesion = async (req, res, next) => {
  try {
    const { usuario_id, ip, agente_usuario } = req.body

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(usuario_id)
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    // Generar token JWT
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    })

    // Calcular fecha de expiración
    const expiracion = new Date()
    expiracion.setDate(expiracion.getDate() + 30)

    const sesion = await Sesion.create({
      usuario_id,
      token,
      ip,
      expiracion,
      agente_usuario,
      is_active: true,
    })

    return res.status(201).json({ success: true, data: sesion })
  } catch (error) {
    next(error)
  }
}

export const createSesionInternal = async (usuario_id, ip, agente_usuario) => {
  try {
    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(usuario_id)
    if (!usuario) {
      throw new Error("Usuario not found")
    }

    // Generar token JWT para la sesión
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    })

    // Calcular fecha de expiración
    const expiracion = new Date()
    expiracion.setDate(expiracion.getDate() + 30)

    // Crear la sesión
    const sesion = await Sesion.create({
      usuario_id,
      token,
      ip,
      agente_usuario: agente_usuario,
      expiracion: expiracion,
      is_active: true,
    })

    return sesion
  } catch (error) {
    throw error
  }
}

// Cerrar sesión
export const closeSesion = async (req, res, next) => {
  try {
    const { id } = req.params

    const sesion = await Sesion.findByPk(id)

    if (!sesion) {
      return res.status(404).json({ success: false, message: "Sesión not found" })
    }

    await sesion.update({ is_active: false })

    return res.status(200).json({ success: true, message: "Sesión closed successfully" })
  } catch (error) {
    next(error)
  }
}

// Cerrar todas las sesiones de un usuario
export const closeAllSesiones = async (req, res, next) => {
  try {
    const { usuario_id } = req.params

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(usuario_id)
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    await Sesion.update(
      { is_active: false },
      {
        where: { usuario_id, is_active: true },
      }
    )

    return res.status(200).json({ success: true, message: "All sessions closed successfully" })
  } catch (error) {
    next(error)
  }
}

// Verificar token
export const verifyToken = async (req, res, next) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" })
    }

    // Verificar si el token existe en la base de datos
    const sesion = await Sesion.findOne({
      where: { token, is_active: true },
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "correo", "role"],
        },
      ],
    })

    if (!sesion) {
      return res.status(401).json({ success: false, message: "Invalid or expired token" })
    }

    // Verificar si el token ha expirado
    if (new Date() > new Date(sesion.expiracion)) {
      await sesion.update({ is_active: false })
      return res.status(401).json({ success: false, message: "Token has expired" })
    }

    return res.status(200).json({
      success: true,
      data: {
        sesion_id: sesion.id,
        usuario: sesion.Usuario,
        expiracion: sesion.expiracion,
      },
    })
  } catch (error) {
    next(error)
  }
}