import { Marca, Producto } from "../models/index.js"
import { sequelize } from "../config/database.js"
import { Op } from "sequelize"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { cleanupEmptyDir } from "../middleware/upload.js"

// Get current directory name (for ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Obtener todas las marcas
export const getAllMarcas = async (req, res, next) => {
  try {
    const marcas = await Marca.findAll({
      where: { is_delete: false },
      order: [["nombre", "ASC"]],
    })

    return res.status(200).json({ success: true, data: marcas })
  } catch (error) {
    next(error)
  }
}

// Obtener marca por ID
export const getMarcaById = async (req, res, next) => {
  try {
    const { id } = req.params

    const marca = await Marca.findOne({
      where: { id, is_delete: false },
    })

    if (!marca) {
      return res.status(404).json({ success: false, message: "Marca not found" })
    }

    return res.status(200).json({ success: true, data: marca })
  } catch (error) {
    next(error)
  }
}

// Crear una nueva marca
export const createMarca = async (req, res, next) => {
  try {
    const { nombre, descripcion } = req.body

    // Get logo image path from multer
    const logo_img = req.file ? req.file.path : null

    const marca = await Marca.create({
      nombre,
      descripcion,
      logo_img: logo_img ? path.relative(path.join(__dirname, ".."), logo_img) : null,
    })

    return res.status(201).json({ success: true, data: marca })
  } catch (error) {
    // If file was uploaded, delete it on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    // Clean up empty directory if it was created
    if (req.marcaUploadDir) {
      const marcaDir = path.join(__dirname, "..", "uploads", "marca", req.marcaUploadDir)
      cleanupEmptyDir(marcaDir)
    }

    next(error)
  }
}

// Actualizar marca
export const updateMarca = async (req, res, next) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, is_active } = req.body

    const marca = await Marca.findOne({
      where: { id, is_delete: false },
    })

    if (!marca) {
      // If file was uploaded, delete it
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }

      // Clean up empty directory if it was created
      if (req.marcaUploadDir) {
        const marcaDir = path.join(__dirname, "..", "uploads", "marca", req.marcaUploadDir)
        cleanupEmptyDir(marcaDir)
      }

      return res.status(404).json({ success: false, message: "Marca not found" })
    }

    // Handle logo update if provided
    let logo_img_path = marca.logo_img
    if (req.file) {
      // Delete old file if it exists
      if (marca.logo_img) {
        const oldPath = path.join(__dirname, "..", marca.logo_img)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }
      logo_img_path = path.relative(path.join(__dirname, ".."), req.file.path)
    }

    await marca.update({
      nombre: nombre || marca.nombre,
      descripcion: descripcion !== undefined ? descripcion : marca.descripcion,
      logo_img: logo_img_path,
      is_active: is_active !== undefined ? is_active : marca.is_active,
    })

    return res.status(200).json({ success: true, data: marca })
  } catch (error) {
    // If file was uploaded, delete it on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    // Clean up empty directory if it was created
    if (req.marcaUploadDir) {
      const marcaDir = path.join(__dirname, "..", "uploads", "marca", req.marcaUploadDir)
      cleanupEmptyDir(marcaDir)
    }

    next(error)
  }
}

// Eliminar marca (soft delete)
export const deleteMarca = async (req, res, next) => {
  try {
    const { id } = req.params

    const marca = await Marca.findOne({
      where: { id, is_delete: false },
    })

    if (!marca) {
      return res.status(404).json({ success: false, message: "Marca not found" })
    }

    // Verificar si hay productos asociados a esta marca
    const productosCount = await Producto.count({
      where: { marca_id: id, is_delete: false },
    })

    if (productosCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete brand with associated products",
        count: productosCount,
      })
    }

    await marca.update({ is_delete: true, is_active: false })

    return res.status(200).json({ success: true, message: "Marca deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Obtener productos por marca
export const getProductosByMarca = async (req, res, next) => {
  try {
    const { id } = req.params

    const marca = await Marca.findOne({
      where: { id, is_delete: false },
    })

    if (!marca) {
      return res.status(404).json({ success: false, message: "Marca not found" })
    }

    const productos = await Producto.findAll({
      where: { marca_id: id, is_delete: false, is_active: true },
    })

    return res.status(200).json({ success: true, data: productos })
  } catch (error) {
    next(error)
  }
}