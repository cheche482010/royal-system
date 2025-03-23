import { Orden, Usuario, DetalleOrden, Producto, Carrito, Inventario } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Obtener todas las órdenes
export const getAllOrdenes = async (req, res, next) => {
  try {
    const ordenes = await Orden.findAll({
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "correo"],
        },
      ],
      order: [["created_at", "DESC"]],
    })

    return res.status(200).json({ success: true, data: ordenes })
  } catch (error) {
    next(error)
  }
}

// Obtener orden por ID
export const getOrdenById = async (req, res, next) => {
  try {
    const { id } = req.params

    const orden = await Orden.findOne({
      where: { id },
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "correo", "documento", "direccion", "telefono"],
        },
        {
          model: DetalleOrden,
          include: [
            {
              model: Producto,
              attributes: ["id", "codigo", "nombre", "descripcion", "producto_img"],
            },
          ],
        },
      ],
    })

    if (!orden) {
      return res.status(404).json({ success: false, message: "Orden not found" })
    }

    return res.status(200).json({ success: true, data: orden })
  } catch (error) {
    next(error)
  }
}

// Obtener órdenes por usuario
export const getOrdenesByUsuario = async (req, res, next) => {
  try {
    const { usuario_id } = req.params

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(usuario_id)
    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    const ordenes = await Orden.findAll({
      where: { usuario_id },
      include: [
        {
          model: DetalleOrden,
          include: [
            {
              model: Producto,
              attributes: ["id", "codigo", "nombre"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    })

    return res.status(200).json({ success: true, data: ordenes })
  } catch (error) {
    next(error)
  }
}

// Crear una nueva orden desde el carrito
export const createOrden = async (req, res, next) => {
  const transaction = await sequelize.transaction()

  try {
    const { usuario_id } = req.body

    // Verificar si el usuario existe
    const usuario = await Usuario.findByPk(usuario_id, { transaction })
    if (!usuario) {
      await transaction.rollback()
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    // Obtener items del carrito del usuario
    const carritoItems = await Carrito.findAll({
      where: { usuario_id, is_delete: false, is_active: true },
      include: [
        {
          model: Producto,
          include: [{ model: Inventario }],
        },
      ],
      transaction,
    })

    if (carritoItems.length === 0) {
      await transaction.rollback()
      return res.status(400).json({ success: false, message: "El carrito está vacío" })
    }

    // Calcular monto total
    let montoTotal = 0
    for (const item of carritoItems) {
      montoTotal += item.Producto.precio_unidad * item.cantidad
    }

    // Crear la orden
    const orden = await Orden.create(
      {
        usuario_id,
        monto_total: montoTotal,
        status: "Pendiente",
      },
      { transaction }
    )

    // Crear detalles de la orden
    for (const item of carritoItems) {
      await DetalleOrden.create(
        {
          orden_id: orden.id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio: item.Producto.precio_unidad,
        },
        { transaction }
      )

      // Actualizar inventario
      const inventario = item.Producto.Inventario
      if (inventario.cantidad_actual < item.cantidad) {
        await transaction.rollback()
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${item.Producto.nombre}. Available: ${inventario.cantidad_actual}`,
        })
      }

      await inventario.update(
        {
          cantidad_actual: inventario.cantidad_actual - item.cantidad,
          estado: inventario.cantidad_actual - item.cantidad <= 0 ? "Agotado" : inventario.estado,
        },
        { transaction }
      )

      // Marcar item del carrito como eliminado
      await item.update({ is_delete: true, is_active: false }, { transaction })
    }

    await transaction.commit()

    return res.status(201).json({ success: true, data: orden })
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

// Actualizar estado de la orden
export const updateOrdenStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const orden = await Orden.findByPk(id)

    if (!orden) {
      return res.status(404).json({ success: false, message: "Orden not found" })
    }

    if (!["Pendiente", "Completa", "Cancelada"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" })
    }

    await orden.update({ status })

    return res.status(200).json({ success: true, data: orden })
  } catch (error) {
    next(error)
  }
}

// Cancelar orden
export const cancelOrden = async (req, res, next) => {
  const transaction = await sequelize.transaction()

  try {
    const { id } = req.params

    const orden = await Orden.findOne({
      where: { id },
      include: [
        {
          model: DetalleOrden,
          include: [
            {
              model: Producto,
              include: [{ model: Inventario }],
            },
          ],
        },
      ],
      transaction,
    })

    if (!orden) {
      await transaction.rollback()
      return res.status(404).json({ success: false, message: "Orden not found" })
    }

    if (orden.status === "Cancelada") {
      await transaction.rollback()
      return res.status(400).json({ success: false, message: "La orden ya está cancelada" })
    }

    if (orden.status === "Completa") {
      await transaction.rollback()
      return res.status(400).json({ success: false, message: "No se puede cancelar una orden completada" })
    }

    // Restaurar inventario
    for (const detalle of orden.DetalleOrdens) {
      const inventario = detalle.Producto.Inventario
      await inventario.update(
        {
          cantidad_actual: inventario.cantidad_actual + detalle.cantidad,
          estado: "Disponible",
        },
        { transaction }
      )
    }

    // Actualizar estado de la orden
    await orden.update({ status: "Cancelada" }, { transaction })

    await transaction.commit()

    return res.status(200).json({ success: true, message: "Orden cancelada correctamente" })
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}