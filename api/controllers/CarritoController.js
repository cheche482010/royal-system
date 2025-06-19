import { Carrito, Usuario, Producto, Marca, Inventario, CarritoProducto } from "../models/index.js"

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
          model: CarritoProducto,
          include: [
            {
              model: Producto,
              attributes: ["id", "codigo", "nombre", "descripcion", "precio_unidad", "producto_img"],
              include: [
                {
                  model: Marca,
                  attributes: ["id", "nombre"],
                },
              ],
            },
          ],
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

    const carrito = await Carrito.findOne({
      where: { usuario_id, is_delete: false, is_active: true },
      include: [
        {
          model: CarritoProducto,
          where: { is_delete: false, is_active: true },
          required: false, 
          include: [
            {
              model: Producto,
              attributes: ["id", "codigo", "nombre", "descripcion", "precio_unidad", "precio_tienda", "precio_distribuidor", "producto_img"],
              include: [
                {
                  model: Marca,
                  attributes: ["id", "nombre"],
                },
              ],
            },
          ],
        },
      ],
    })

    if (!carrito) {
      // Si no existe un carrito activo, crear uno nuevo
      const newCarrito = await Carrito.create({
        usuario_id,
        is_active: true,
        is_delete: false,
      })

      return res.status(200).json({ success: true, data: [] })
    }

    // Transformar los datos para mantener la estructura esperada por el frontend
    const formattedCartItems = carrito.CarritoProductos ? carrito.CarritoProductos.map((item) => ({
      id: item.id,
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      Producto: item.Producto,
    })) : []

    return res.status(200).json({ success: true, data: formattedCartItems })
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
    if (producto.Inventario && producto.Inventario.cantidad_actual < cantidad) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock. Available: " + producto.Inventario.cantidad_actual,
      })
    }

    // Buscar o crear un carrito activo para el usuario
    let carrito = await Carrito.findOne({
      where: { usuario_id, is_delete: false, is_active: true },
    })

    if (!carrito) {
      carrito = await Carrito.create({
        usuario_id,
        is_active: true,
        is_delete: false,
      })
    }

    // Verificar si el producto ya está en el carrito (incluyendo los eliminados)
    const existingItem = await CarritoProducto.findOne({
      where: {
        carrito_id: carrito.id,
        producto_id,
      },
      paranoid: false // Esto incluye registros marcados como eliminados
    })

    if (existingItem) {
      // Si el item existe pero está marcado como eliminado, reactivarlo
      if (existingItem.is_delete) {
        await existingItem.update({
          is_delete: false,
          is_active: true,
          cantidad: cantidad // Puedes establecer la nueva cantidad o sumar a la existente
        })
      } else {
        // Si el item existe y no está eliminado, actualizar cantidad
        await existingItem.update({
          cantidad: existingItem.cantidad + cantidad,
        })
      }

      return res.status(200).json({ success: true, data: existingItem })
    }

    // Crear nuevo item en el carrito
    const carritoProducto = await CarritoProducto.create({
      carrito_id: carrito.id,
      producto_id,
      cantidad,
      is_active: true,
      is_delete: false,
    })

    return res.status(201).json({ success: true, data: carritoProducto })
  } catch (error) {
    console.error("Error en addToCart:", error)
    next(error)
  }
}

// Actualizar item del cart
export const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params
    const { cantidad } = req.body

    const carritoProducto = await CarritoProducto.findOne({
      where: { id, is_delete: false, is_active: true },
      include: [
        {
          model: Producto,
          include: [{ model: Inventario }],
        },
      ],
    })

    if (!carritoProducto) {
      return res.status(404).json({ success: false, message: "Cart item not found" })
    }

    // Verificar si hay suficiente stock
    if (carritoProducto.Producto.Inventario && carritoProducto.Producto.Inventario.cantidad_actual < cantidad) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock. Available: " + carritoProducto.Producto.Inventario.cantidad_actual,
      })
    }

    await carritoProducto.update({ cantidad })

    return res.status(200).json({ success: true, data: carritoProducto })
  } catch (error) {
    next(error)
  }
}

// Eliminar item del cart (soft delete)
export const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params

    const carritoProducto = await CarritoProducto.findOne({
      where: { id, is_delete: false, is_active: true },
    })

    if (!carritoProducto) {
      return res.status(404).json({ success: false, message: "Cart item not found" })
    }

    await carritoProducto.update({ is_delete: true, is_active: false })

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

    // Buscar el carrito activo del usuario
    const carrito = await Carrito.findOne({
      where: { usuario_id, is_delete: false, is_active: true },
    })

    if (!carrito) {
      return res.status(404).json({ success: false, message: "Active cart not found" })
    }

    // Marcar todos los productos del carrito como eliminados
    await CarritoProducto.update(
      { is_delete: true, is_active: false },
      {
        where: { carrito_id: carrito.id, is_delete: false, is_active: true },
      },
    )

    return res.status(200).json({ success: true, message: "Cart cleared successfully" })
  } catch (error) {
    next(error)
  }
}
