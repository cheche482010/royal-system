// controllers/CarritoController.js
import { Carrito } from "../models/index.js"
import { Op } from "sequelize"

export const getAllCarritos = async (req, res, next) => {
  try {
    const carritos = await Carrito.findAll({
      where: { is_delete: false },
      include: [
        { model: req.models.Usuario, as: 'usuario' },
        { model: req.models.Producto, as: 'producto' }
      ]
    })
    return res.status(200).json({ success: true, data: carritos })
  } catch (error) {
    next(error)
  }
}

export const getCarritoById = async (req, res, next) => {
  try {
    const { id } = req.params
    const carrito = await Carrito.findByPk(id, {
      where: { is_delete: false },
      include: [
        { model: req.models.Usuario, as: 'usuario' },
        { model: req.models.Producto, as: 'producto' }
      ]
    })
    if (!carrito) {
      return res.status(404).json({ success: false, message: "Carrito not found" })
    }
    return res.status(200).json({ success: true, data: carrito })
  } catch (error) {
    next(error)
  }
}

export const createCarrito = async (req, res, next) => {
  try {
    const { usuario_id, producto_id, cantidad } = req.body
    const existingCarrito = await Carrito.findOne({
      where: {
        usuario_id,
        producto_id,
        is_delete: false
      }
    })
    if (existingCarrito) {
      return res.status(400).json({
        success: false,
        message: "Product already exists in cart"
      })
    }
    const carrito = await Carrito.create({
      usuario_id,
      producto_id,
      cantidad,
      is_active: true,
      is_delete: false
    })
    return res.status(201).json({ success: true, data: carrito })
  } catch (error) {
    next(error)
  }
}

export const updateCarrito = async (req, res, next) => {
  try {
    const { id } = req.params
    const { cantidad } = req.body
    const carrito = await Carrito.findByPk(id)
    if (!carrito || carrito.is_delete) {
      return res.status(404).json({ success: false, message: "Carrito not found" })
    }
    await carrito.update({
      cantidad: cantidad || carrito.cantidad
    })
    return res.status(200).json({ success: true, data: carrito })
  } catch (error) {
    next(error)
  }
}

export const deleteCarrito = async (req, res, next) => {
  try {
    const { id } = req.params
    const carrito = await Carrito.findByPk(id)
    if (!carrito || carrito.is_delete) {
      return res.status(404).json({ success: false, message: "Carrito not found" })
    }
    await carrito.update({ is_delete: true })
    return res.status(200).json({ success: true, message: "Carrito deleted successfully" })
  } catch (error) {
    next(error)
  }
}