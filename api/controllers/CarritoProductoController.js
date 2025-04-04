import { CarritoProducto, Carrito, Producto, Inventario } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Obtener todos los items de carrito_producto
export const getAllCarritoProductos = async (req, res, next) => {
  try {
    const carritoProductos = await CarritoProducto.findAll({
      where: { is_delete: false, is_active: true },
      include: [
        {
          model: Carrito,
          attributes: ["id", "usuario_id"],
        },
        {
          model: Producto,
          attributes: ["id", "codigo", "nombre", "descripcion", "precio_unidad", "producto_img"],
        },
      ],
    })

    return res.status(200).json({ success: true, data: carritoProductos })
  } catch (error) {
    next(error)
  }
}

// Obtener un item de carrito_producto por ID
export const getCarritoProductoById = async (req, res, next) => {
  try {
    const { id } = req.params

    const carritoProducto = await CarritoProducto.findOne({
      where: { id, is_delete: false, is_active: true },
      include: [
        {
          model: Carrito,
          attributes: ["id", "usuario_id"],
        },
        {
          model: Producto,
          attributes: ["id", "codigo", "nombre", "descripcion", "precio_unidad", "producto_img"],
        },
      ],
    })

    if (!carritoProducto) {
      return res.status(404).json({ success: false, message: "Carrito producto not found" })
    }

    return res.status(200).json({ success: true, data: carritoProducto })
  } catch (error) {
    next(error)
  }
}

// Obtener items de carrito_producto por carrito_id
export const getCarritoProductosByCarritoId = async (req, res, next) => {
  try {
    const { carrito_id } = req.params

    const carritoProductos = await CarritoProducto.findAll({
      where: { carrito_id, is_delete: false, is_active: true },
      include: [
        {
          model: Producto,
          attributes: ["id", "codigo", "nombre", "descripcion", "precio_unidad", "producto_img"],
        },
      ],
    })

    return res.status(200).json({ success: true, data: carritoProductos })
  } catch (error) {
    next(error)
  }
}

// Agregar un producto al carrito
export const addProductToCarrito = async (req, res, next) => {
  const t = await sequelize.transaction()

  try {
    const { carrito_id, producto_id, cantidad } = req.body

    // Verificar si el carrito existe
    const carrito = await Carrito.findOne({
      where: { id: carrito_id, is_delete: false, is_active: true },
      transaction: t,
    })

    if (!carrito) {
      await t.rollback()
      return res.status(404).json({ success: false, message: "Carrito not found" })
    }

    // Verificar si el producto existe
    const producto = await Producto.findOne({
      where: { id: producto_id, is_delete: false, is_active: true },
      include: [{ model: Inventario }],
      transaction: t,
    })

    if (!producto) {
      await t.rollback()
      return res.status(404).json({ success: false, message: "Producto not found" })
    }

    // Verificar si hay suficiente stock
    if (producto.Inventario.cantidad_actual < cantidad) {
      await t.rollback()
      return res.status(400).json({
        success: false,
        message: "Insufficient stock. Available: " + producto.Inventario.cantidad_actual,
      })
    }

    // Verificar si el producto ya está en el carrito
    const existingItem = await CarritoProducto.findOne({
      where: { carrito_id, producto_id, is_delete: false, is_active: true },
      transaction: t,
    })

    if (existingItem) {
      // Actualizar cantidad
      await existingItem.update(
        {
          cantidad: existingItem.cantidad + cantidad,
        },
        { transaction: t },
      )

      await t.commit()
      return res.status(200).json({ success: true, data: existingItem })
    }

    // Crear nuevo item en el carrito
    const carritoProducto = await CarritoProducto.create(
      {
        carrito_id,
        producto_id,
        cantidad,
      },
      { transaction: t },
    )

    await t.commit()
    return res.status(201).json({ success: true, data: carritoProducto })
  } catch (error) {
    await t.rollback()
    next(error)
  }
}

// Actualizar cantidad de un producto en el carrito
export const updateCarritoProducto = async (req, res, next) => {
  const t = await sequelize.transaction()

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
      transaction: t,
    })

    if (!carritoProducto) {
      await t.rollback()
      return res.status(404).json({ success: false, message: "Carrito producto not found" })
    }

    // Verificar si hay suficiente stock
    if (carritoProducto.Producto.Inventario.cantidad_actual < cantidad) {
      await t.rollback()
      return res.status(400).json({
        success: false,
        message: "Insufficient stock. Available: " + carritoProducto.Producto.Inventario.cantidad_actual,
      })
    }

    await carritoProducto.update({ cantidad }, { transaction: t })

    await t.commit()
    return res.status(200).json({ success: true, data: carritoProducto })
  } catch (error) {
    await t.rollback()
    next(error)
  }
}

// Eliminar un producto del carrito (soft delete)
export const removeProductFromCarrito = async (req, res, next) => {
  try {
    const { id } = req.params

    const carritoProducto = await CarritoProducto.findOne({
      where: { id, is_delete: false, is_active: true },
    })

    if (!carritoProducto) {
      return res.status(404).json({ success: false, message: "Carrito producto not found" })
    }

    await carritoProducto.update({ is_delete: true, is_active: false })

    return res.status(200).json({ success: true, message: "Product removed from cart" })
  } catch (error) {
    next(error)
  }
}

// Eliminar todos los productos de un carrito
export const clearCarritoProductos = async (req, res, next) => {
  try {
    const { carrito_id } = req.params

    // Verificar si el carrito existe
    const carrito = await Carrito.findOne({
      where: { id: carrito_id, is_delete: false, is_active: true },
    })

    if (!carrito) {
      return res.status(404).json({ success: false, message: "Carrito not found" })
    }

    await CarritoProducto.update(
      { is_delete: true, is_active: false },
      {
        where: { carrito_id, is_delete: false, is_active: true },
      },
    )

    return res.status(200).json({ success: true, message: "Cart products cleared successfully" })
  } catch (error) {
    next(error)
  }
}

