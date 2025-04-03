import { Carrito, Usuario, Producto, Inventario } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Obtener todos los items del carrito
export const getAllCarritoItems = async (req, res, next) => {
  try {
    const carritoItems = await Carrito.findAll({
      where: { is_delete: false, is_active: true },
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "correo"],
        },
        {
          model: Producto,
          attributes: ["id", "codigo", "nombre", "descripcion", "precio_unidad", "producto_img"],
        },
      ],
    })

    return res.status(200).json({ success: true, data: carritoItems })
  } catch (error) {
    next(error)
  }
}

// Obtener carrito por usuario
export const getCarritoByUsuario = async (req, res, next) => {
  try {
    const { usuario_id } = req.params

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(usuario_id)
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    const carritoItems = await Carrito.findAll({
      where: { usuario_id, is_delete: false, is_active: true },
      include: [
        {
          model: Producto,
          attributes: ["id", "codigo", "nombre", "descripcion", "precio_unidad", "producto_img"],
        },
      ],
    })

    return res.status(200).json({ success: true, data: carritoItems })
  } catch (error) {
    next(error)
  }
}

// Agregar item al carrito
export const addToCarrito = async (req, res, next) => {
  try {
    const { usuario_id, producto_id, cantidad } = req.body

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(usuario_id)
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    // Verificar si el producto existe
    const producto = await Producto.findOne({
      where: { id: producto_id, is_delete: false, is_active: true },
      include: [{ model: Inventario }],
    })

    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto not found" })
    }

    // Verificar si hay suficiente stock
    if (producto.Inventario.cantidad_actual < cantidad) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock. Available: " + producto.Inventario.cantidad_actual,
      })
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = await Carrito.findOne({
      where: { usuario_id, producto_id, is_delete: false, is_active: true },
    })

    if (existingItem) {
      // Actualizar cantidad
      await existingItem.update({
        cantidad: existingItem.cantidad + cantidad,
      })

      return res.status(200).json({ success: true, data: existingItem })
    }

    // Crear nuevo item en el carrito
    const carritoItem = await Carrito.create({
      usuario_id,
      producto_id,
      cantidad,
    })

    return res.status(201).json({ success: true, data: carritoItem })
  } catch (error) {
    next(error)
  }
}

// Actualizar item del carrito
export const updateCarritoItem = async (req, res, next) => {
  try {
    const { id } = req.params
    const { cantidad } = req.body

    const carritoItem = await Carrito.findOne({
      where: { id, is_delete: false, is_active: true },
      include: [
        {
          model: Producto,
          include: [{ model: Inventario }],
        },
      ],
    })

    if (!carritoItem) {
      return res.status(404).json({ success: false, message: "Carrito item not found" })
    }

    // Verificar si hay suficiente stock
    if (carritoItem.Producto.Inventario.cantidad_actual < cantidad) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock. Available: " + carritoItem.Producto.Inventario.cantidad_actual,
      })
    }

    await carritoItem.update({ cantidad })

    return res.status(200).json({ success: true, data: carritoItem })
  } catch (error) {
    next(error)
  }
}

// Eliminar item del carrito (soft delete)
export const removeFromCarrito = async (req, res, next) => {
  try {
    const { id } = req.params

    const carritoItem = await Carrito.findOne({
      where: { id, is_delete: false, is_active: true },
    })

    if (!carritoItem) {
      return res.status(404).json({ success: false, message: "Carrito item not found" })
    }

    await carritoItem.update({ is_delete: true, is_active: false })

    return res.status(200).json({ success: true, message: "Item removed from carrito" })
  } catch (error) {
    next(error)
  }
}

// Vaciar carrito de un usuario
export const clearCarrito = async (req, res, next) => {
  try {
    const { usuario_id } = req.params

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(usuario_id)
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    await Carrito.update(
      { is_delete: true, is_active: false },
      {
        where: { usuario_id, is_delete: false, is_active: true },
      }
    )

    return res.status(200).json({ success: true, message: "Carrito cleared successfully" })
  } catch (error) {
    next(error)
  }
}