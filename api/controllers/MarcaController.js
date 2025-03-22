// controllers/MarcaController.js
import { Marca } from "../models/index.js"
import { Op } from "sequelize"

export const getAllMarcas = async (req, res, next) => {
  try {
    const marcas = await Marca.findAll({
      where: { is_delete: false },
      include: [{ model: req.models.Producto, as: 'productos' }]
    })
    return res.status(200).json({ success: true, data: marcas })
  } catch (error) {
    next(error)
  }
}

export const getMarcaById = async (req, res, next) => {
  try {
    const { id } = req.params
    const marca = await Marca.findByPk(id, {
      where: { is_delete: false },
      include: [{ model: req.models.Producto, as: 'productos' }]
    })
    if (!marca) {
      return res.status(404).json({ success: false, message: "Marca not found" })
    }
    return res.status(200).json({ success: true, data: marca })
  } catch (error) {
    next(error)
  }
}

export const createMarca = async (req, res, next) => {
  try {
    const { nombre, descripcion, logo_img } = req.body
    const existingMarca = await Marca.findOne({
      where: {
        nombre,
        is_delete: false
      }
    })
    if (existingMarca) {
      return res.status(400).json({
        success: false,
        message: "Brand with this name already exists"
      })
    }
    const marca = await Marca.create({
      nombre,
      descripcion,
      logo_img,
      is_active: true,
      is_delete: false
    })
    return res.status(201).json({ success: true, data: marca })
  } catch (error) {
    next(error)
  }
}

export const updateMarca = async (req, res, next) => {
  try {
    const { id } = req.params
    const { nombre, descripcion, logo_img } = req.body
    const marca = await Marca.findByPk(id)
    if (!marca || marca.is_delete) {
      return res.status(404).json({ success: false, message: "Marca not found" })
    }
    const existingMarca = await Marca.findOne({
      where: {
        nombre,
        id: { [Op.ne]: id },
        is_delete: false
      }
    })
    if (existingMarca) {
      return res.status(400).json({
        success: false,
        message: "Brand with this name already exists"
      })
    }
    await marca.update({
      nombre: nombre || marca.nombre,
      descripcion: descripcion || marca.descripcion,
      logo_img: logo_img || marca.logo_img
    })
    return res.status(200).json({ success: true, data: marca })
  } catch (error) {
    next(error)
  }
}

export const deleteMarca = async (req, res, next) => {
  try {
    const { id } = req.params
    const marca = await Marca.findByPk(id)
    if (!marca || marca.is_delete) {
      return res.status(404).json({ success: false, message: "Marca not found" })
    }
    await marca.update({ is_delete: true })
    return res.status(200).json({ success: true, message: "Marca deleted successfully" })
  } catch (error) {
    next(error)
  }
}