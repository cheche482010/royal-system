import { Categoria, Producto } from "../models/index.js"
import { sequelize } from "../config/database.js"
import { Op } from "sequelize"

// Obtener todas las categorías
export const getAllCategorias = async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll({
      where: { is_delete: false },
      order: [["nombre", "ASC"]],
    })

    return res.status(200).json({ success: true, data: categorias })
  } catch (error) {
    next(error)
  }
}

// Obtener categoría por ID
export const getCategoriaById = async (req, res, next) => {
  try {
    const { id } = req.params

    const categoria = await Categoria.findOne({
      where: { id, is_delete: false },
    })

    if (!categoria) {
      return res.status(404).json({ success: false, message: "Categoría not found" })
    }

    return res.status(200).json({ success: true, data: categoria })
  } catch (error) {
    next(error)
  }
}

// Crear una nueva categoría
export const createCategoria = async (req, res, next) => {
  try {
    const { nombre, codigo } = req.body

    // Verificar si ya existe una categoría con el mismo código
    const existingCategoria = await Categoria.findOne({
      where: { codigo, is_delete: false },
    })

    if (existingCategoria) {
      return res.status(400).json({ success: false, message: "Código de categoría ya existe" })
    }

    const categoria = await Categoria.create({
      nombre,
      codigo,
    })

    return res.status(201).json({ success: true, data: categoria })
  } catch (error) {
    next(error)
  }
}

// Actualizar categoría
export const updateCategoria = async (req, res, next) => {
  try {
    const { id } = req.params
    const { nombre, codigo, is_active } = req.body

    const categoria = await Categoria.findOne({
      where: { id, is_delete: false },
    })

    if (!categoria) {
      return res.status(404).json({ success: false, message: "Categoría not found" })
    }

    // Verificar si el nuevo código ya existe en otra categoría
    if (codigo && codigo !== categoria.codigo) {
      const existingCategoria = await Categoria.findOne({
        where: { codigo, id: { [Op.ne]: id }, is_delete: false },
      })

      if (existingCategoria) {
        return res.status(400).json({ success: false, message: "Código de categoría ya existe" })
      }
    }

    await categoria.update({
      nombre: nombre || categoria.nombre,
      codigo: codigo || categoria.codigo,
      is_active: is_active !== undefined ? is_active : categoria.is_active,
    })

    return res.status(200).json({ success: true, data: categoria })
  } catch (error) {
    next(error)
  }
}

// Eliminar categoría (soft delete)
export const deleteCategoria = async (req, res, next) => {
  try {
    const { id } = req.params

    const categoria = await Categoria.findOne({
      where: { id, is_delete: false },
    })

    if (!categoria) {
      return res.status(404).json({ success: false, message: "Categoría not found" })
    }

    // Verificar si hay productos asociados a esta categoría
    const productosCount = await Producto.count({
      where: { categoria_id: id, is_delete: false },
    })

    if (productosCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with associated products",
        count: productosCount,
      })
    }

    await categoria.update({ is_delete: true, is_active: false })

    return res.status(200).json({ success: true, message: "Categoría deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Obtener productos por categoría
export const getProductosByCategoria = async (req, res, next) => {
  try {
    const { id } = req.params

    const categoria = await Categoria.findOne({
      where: { id, is_delete: false },
    })

    if (!categoria) {
      return res.status(404).json({ success: false, message: "Categoría not found" })
    }

    const productos = await Producto.findAll({
      where: { categoria_id: id, is_delete: false, is_active: true },
    })

    return res.status(200).json({ success: true, data: productos })
  } catch (error) {
    next(error)
  }
}