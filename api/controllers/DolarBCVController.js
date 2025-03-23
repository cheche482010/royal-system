import { DolarBCV } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Obtener todas las tasas de cambio
export const getAllTasas = async (req, res, next) => {
  try {
    const tasas = await DolarBCV.findAll({
      where: { is_delete: false },
      order: [["fecha_inicio", "DESC"]],
    })

    return res.status(200).json({ success: true, data: tasas })
  } catch (error) {
    next(error)
  }
}

// Obtener tasa de cambio por ID
export const getTasaById = async (req, res, next) => {
  try {
    const { id } = req.params

    const tasa = await DolarBCV.findOne({
      where: { id, is_delete: false },
    })

    if (!tasa) {
      return res.status(404).json({ success: false, message: "Tasa de cambio not found" })
    }

    return res.status(200).json({ success: true, data: tasa })
  } catch (error) {
    next(error)
  }
}

// Obtener tasa de cambio actual
export const getCurrentTasa = async (req, res, next) => {
  try {
    const tasa = await DolarBCV.findOne({
      where: { is_active: true, is_delete: false },
      order: [["fecha_inicio", "DESC"]],
    })

    if (!tasa) {
      return res.status(404).json({ success: false, message: "No active exchange rate found" })
    }

    return res.status(200).json({ success: true, data: tasa })
  } catch (error) {
    next(error)
  }
}

// Crear una nueva tasa de cambio
export const createTasa = async (req, res, next) => {
  const transaction = await sequelize.transaction()

  try {
    const { tasa_cambio } = req.body

    // Desactivar la tasa actual
    await DolarBCV.update(
      { is_active: false, fecha_fin: new Date() },
      {
        where: { is_active: true },
        transaction,
      }
    )

    // Crear nueva tasa
    const nuevaTasa = await DolarBCV.create(
      {
        tasa_cambio,
        fecha_inicio: new Date(),
        is_active: true,
      },
      { transaction }
    )

    await transaction.commit()

    return res.status(201).json({ success: true, data: nuevaTasa })
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

// Actualizar tasa de cambio
export const updateTasa = async (req, res, next) => {
  try {
    const { id } = req.params
    const { tasa_cambio, is_active } = req.body

    const tasa = await DolarBCV.findOne({
      where: { id, is_delete: false },
    })

    if (!tasa) {
      return res.status(404).json({ success: false, message: "Tasa de cambio not found" })
    }

    // Si estamos activando esta tasa, desactivar las demás
    if (is_active && !tasa.is_active) {
      await DolarBCV.update(
        { is_active: false, fecha_fin: new Date() },
        {
          where: { is_active: true, id: { [Op.ne]: id } },
        }
      )
    }

    await tasa.update({
      tasa_cambio: tasa_cambio || tasa.tasa_cambio,
      is_active: is_active !== undefined ? is_active : tasa.is_active,
      fecha_fin: is_active === false && tasa.is_active ? new Date() : tasa.fecha_fin,
    })

    return res.status(200).json({ success: true, data: tasa })
  } catch (error) {
    next(error)
  }
}

// Eliminar tasa de cambio (soft delete)
export const deleteTasa = async (req, res, next) => {
  try {
    const { id } = req.params

    const tasa = await DolarBCV.findOne({
      where: { id, is_delete: false },
    })

    if (!tasa) {
      return res.status(404).json({ success: false, message: "Tasa de cambio not found" })
    }

    await tasa.update({ is_delete: true, is_active: false })

    return res.status(200).json({ success: true, message: "Tasa de cambio deleted successfully" })
  } catch (error) {
    next(error)
  }
}