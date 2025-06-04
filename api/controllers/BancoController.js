import { Banco } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Obtener todos los bancos
export const getAllBancos = async (req, res, next) => {
  try {
    const bancos = await Banco.findAll({
      order: [["nombre_banco", "ASC"]], 
    })

    return res.status(200).json({ success: true, data: bancos })
  } catch (error) {
    next(error)
  }
}

// Obtener banco por ID
export const getBancoById = async (req, res, next) => {
  try {
    const { id } = req.params

    const banco = await Banco.findByPk(id)

    if (!banco) {
      return res.status(404).json({ success: false, message: "Banco no encontrado" })
    }

    return res.status(200).json({ success: true, data: banco })
  } catch (error) {
    next(error)
  }
}

// Crear un nuevo banco
export const createBanco = async (req, res, next) => {
  try {
    const { codigo, nombre_banco } = req.body

    if (!codigo || !nombre_banco) {
      return res.status(400).json({ 
        success: false, 
        message: "Código y nombre del banco son requeridos" 
      })
    }

    const banco = await Banco.create({
      codigo,
      nombre_banco
    })

    return res.status(201).json({ success: true, data: banco })
  } catch (error) {
    next(error)
  }
}

// Actualizar banco
export const updateBanco = async (req, res, next) => {
  try {
    const { id } = req.params
    const { codigo, nombre_banco } = req.body

    const banco = await Banco.findByPk(id)

    if (!banco) {
      return res.status(404).json({ success: false, message: "Banco no encontrado" })
    }

    await banco.update({
      codigo: codigo || banco.codigo,
      nombre_banco: nombre_banco || banco.nombre_banco
    })

    return res.status(200).json({ success: true, data: banco })
  } catch (error) {
    next(error)
  }
}

// Eliminar banco
export const deleteBanco = async (req, res, next) => {
  try {
    const { id } = req.params

    const banco = await Banco.findByPk(id)

    if (!banco) {
      return res.status(404).json({ success: false, message: "Banco no encontrado" })
    }

    await banco.destroy()

    return res.status(200).json({ 
      success: true, 
      message: "Banco eliminado correctamente" 
    })
  } catch (error) {
    next(error)
  }
}