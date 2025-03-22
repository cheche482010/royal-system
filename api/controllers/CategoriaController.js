// controllers/CategoriaController.js
import { Categoria } from "../models/index.js"
import { Op } from "sequelize"

export const getAllCategorias = async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll({
      where: { is_delete: false },
      include: [{ model: req.models.Producto, as: 'productos' }]
    })
    return res.status(200).json({ success: true, data: categorias })
  } catch (error) {
    next(error)
  }
}

export const getCategoriaById = async (req, res, next) => {
  try {
    const { id } = req.params
    const categoria = await Categoria.findByPk(id, {
      where: { is_delete: false },
      include: [{ model: req.models.Producto, as: 'productos' }]
    })
    if (!categoria) {
      return res.status(404).json({ success: false, message: "Categoria not found" })
    }
    return res.status(200).json({ success: true, data: categoria })
  } catch (error) {
    next(error)
  }
}

export const createCategoria = async (req, res, next) => {
  try {
    const { nombre, codigo, descripcion } = req.body
    const existingCategoria = await Categoria.findOne({
      where: {
        [Op.or]: [
          { nombre },
          { codigo }
        ],
        is_delete: false
      }
    })
    if (existingCategoria) {
      return res.status(400).json({
        success: false,
        message: "Category with this name or code already exists"
      })
    }
    const categoria = await Categoria.create({
      nombre,
      codigo,
      descripcion,
      is_active: true,
      is_delete: false
    })
    return res.status(201).json({ success: true, data: categoria })
  } catch (error) {
    next(error)
  }
}

export const updateCategoria = async (req, res, next) => {
  try {
    const { id } = req.params
    const { nombre, codigo, descripcion } = req.body
    const categoria = await Categoria.findByPk(id)
    if (!categoria || categoria.is_delete) {
      return res.status(404).json({ success: false, message: "Categoria not found" })
    }
    const existingCategoria = await Categoria.findOne({
      where: {
        [Op.or]: [
          { nombre },
          { codigo }
        ],
        id: { [Op.ne]: id },
        is_delete: false
      }
    })
    if (existingCategoria) {
      return res.status(400).json({
        success: false,
        message: "Category with this name or code already exists"
      })
    }
    await categoria.update({
      nombre: nombre || categoria.nombre,
      codigo: codigo || categoria.codigo,
      descripcion: descripcion || categoria.descripcion
    })
    return res.status(200).json({ success: true, data: categoria })
  } catch (error) {
    next(error)
  }
}

export const deleteCategoria = async (req, res, next) => {
  try {
    const { id } = req.params
    const categoria = await Categoria.findByPk(id)
    if (!categoria || categoria.is_delete) {
      return res.status(404).json({ success: false, message: "Categoria not found" })
    }
    await categoria.update({ is_delete: true })
    return res.status(200).json({ success: true, message: "Categoria deleted successfully" })
  } catch (error) {
    next(error)
  }
}