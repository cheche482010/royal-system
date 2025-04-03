import { Bitacora, Usuario } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Obtener todas las entradas de bitácora
export const getAllBitacoras = async (req, res, next) => {
  try {
    const bitacoras = await Bitacora.findAll({
      where: { is_delete: false },
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "correo"],
        },
      ],
      order: [["fecha", "DESC"], ["hora", "DESC"]],
    })

    return res.status(200).json({ success: true, data: bitacoras })
  } catch (error) {
    next(error)
  }
}

// Obtener bitácora por ID
export const getBitacoraById = async (req, res, next) => {
  try {
    const { id } = req.params

    const bitacora = await Bitacora.findOne({
      where: { id, is_delete: false },
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "correo"],
        },
      ],
    })

    if (!bitacora) {
      return res.status(404).json({ success: false, message: "Bitácora not found" })
    }

    return res.status(200).json({ success: true, data: bitacora })
  } catch (error) {
    next(error)
  }
}

// Crear una nueva entrada de bitácora
export const createBitacora = async (req, res, next) => {
  try {
    const { usuario_id, accion } = req.body

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(usuario_id)
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    // Obtener fecha y hora actual
    const now = new Date()
    const fecha = now.toISOString().split("T")[0]
    const hora = now.toTimeString().split(" ")[0]

    const bitacora = await Bitacora.create({
      usuario_id,
      fecha,
      hora,
      accion,
    })

    return res.status(201).json({ success: true, data: bitacora })
  } catch (error) {
    next(error)
  }
}

// Actualizar bitácora
export const updateBitacora = async (req, res, next) => {
  try {
    const { id } = req.params
    const { usuario_id, accion } = req.body

    const bitacora = await Bitacora.findOne({
      where: { id, is_delete: false },
    })

    if (!bitacora) {
      return res.status(404).json({ success: false, message: "Bitácora not found" })
    }

    // Verificar si el usuario existe
    if (usuario_id) {
      const usuario = await Usuario.findByPk(usuario_id)
      if (!usuario) {
        return res.status(404).json({ success: false, message: "Usuario not found" })
      }
    }

    await bitacora.update({
      usuario_id: usuario_id || bitacora.usuario_id,
      accion: accion || bitacora.accion,
    })

    return res.status(200).json({ success: true, data: bitacora })
  } catch (error) {
    next(error)
  }
}

// Eliminar bitácora (soft delete)
export const deleteBitacora = async (req, res, next) => {
  try {
    const { id } = req.params

    const bitacora = await Bitacora.findOne({
      where: { id, is_delete: false },
    })

    if (!bitacora) {
      return res.status(404).json({ success: false, message: "Bitácora not found" })
    }

    await bitacora.update({ is_delete: true })

    return res.status(200).json({ success: true, message: "Bitácora deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Eliminar bitácora permanentemente
export const hardDeleteBitacora = async (req, res, next) => {
  try {
    const { id } = req.params

    const bitacora = await Bitacora.findByPk(id)

    if (!bitacora) {
      return res.status(404).json({ success: false, message: "Bitácora not found" })
    }

    await bitacora.destroy()

    return res.status(200).json({ success: true, message: "Bitácora permanently deleted" })
  } catch (error) {
    next(error)
  }
}