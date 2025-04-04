import { Carrito, Usuario, Producto, Inventario } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Obtener todos los items del cart
export const getAllCartItems = async (req, res, next) => {
  try {
    const cartItems = await Carrito.findAll({
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

    return res.status(200).json({ success: true, data: cartItems })
  } catch (error) {
    next(error)
  }
}

// Obtener cart por usuario
export const getCartByUsuario = async (req, res, next) => {
  try {
    const { usuario_id } = req.params

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(usuario_id)
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    const cartItems = await Carrito.findAll({
      where: { usuario_id, is_delete: false, is_active: true },
      include: [
        {
          model: Producto,
          attributes: ["id", "codigo", "nombre", "descripcion", "precio_unidad", "producto_img"],
        },
      ],
    })

    return res.status(200).json({ success: true, data: cartItems })
  } catch (error) {
    next(error)
  }
}

// Agregar item al cart
export const addToCart = async (req, res, next) => {
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

    // Verificar si el producto ya está en el cart
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

    // Crear nuevo item en el cart
    const cartItem = await Carrito.create({
      usuario_id,
      producto_id,
      cantidad,
    })

    return res.status(201).json({ success: true, data: cartItem })
  } catch (error) {
    next(error)
  }
}

// Actualizar item del cart
export const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params
    const { cantidad } = req.body

    const cartItem = await Carrito.findOne({
      where: { id, is_delete: false, is_active: true },
      include: [
        {
          model: Producto,
          include: [{ model: Inventario }],
        },
      ],
    })

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" })
    }

    // Verificar si hay suficiente stock
    if (cartItem.Producto.Inventario.cantidad_actual < cantidad) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock. Available: " + cartItem.Producto.Inventario.cantidad_actual,
      })
    }

    await carritoItem.update({ cantidad })

    return res.status(200).json({ success: true, data: cartItem })
  } catch (error) {
    next(error)
  }
}

// Eliminar item del cart (soft delete)
export const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params

    const cartItem = await Carrito.findOne({
      where: { id, is_delete: false, is_active: true },
    })

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Cart item not found" })
    }

    await carritoItem.update({ is_delete: true, is_active: false })

    return res.status(200).json({ success: true, message: "Item removed from cart" })
  } catch (error) {
    next(error)
  }
}

// Vaciar cart de un usuario
export const clearCart = async (req, res, next) => {
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

    return res.status(200).json({ success: true, message: "Cart cleared successfully" })
  } catch (error) {
    next(error)
  }
}