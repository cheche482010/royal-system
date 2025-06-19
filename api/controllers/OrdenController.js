import { Orden, Usuario, DetalleOrden, Producto, Carrito, Inventario, Envio } from "../models/index.js"
import { sequelize } from "../config/database.js"
import { crearNotificacionOrdenCreada, crearNotificacionCambioEstado } from "./NotificacionController.js"

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
      attributes: ["id", "status", "is_active", "is_delete", "created_at"],
      include: [
        {
          model: Usuario,
          attributes: ["id", "nombre", "documento"],
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
        {
          model: Envio,
          attributes: ["id", "nombre_receptor", "direccion", "ciudad", "estado", "telefono"],
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
    const { usuario_id, monto_total, monto_total_bs, items } = req.body
    console.log("body:", req.body)
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
          through: { attributes: ["cantidad"] },
          include: [{ model: Inventario }],
        },
      ],
      transaction,
    })

    if (carritoItems.length === 0) {
      await transaction.rollback()
      return res.status(400).json({ success: false, message: "El carrito está vacío" })
    }

    // Crear la orden con los nuevos campos
    const orden = await Orden.create(
      {
        usuario_id,
        monto_total,
        monto_total_bs,
        status: "Pendiente",
        is_active: true,
        is_delete: false,
      },
      { transaction },
    )

    // Crear detalles de la orden usando los datos enviados
    for (const item of items) {
      // Crear detalle de orden
      await DetalleOrden.create(
        {
          orden_id: orden.id,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          tipo_precio: item.tipo_precio,
          precio_bs: item.precio_bs,
        },
        { transaction },
      )

      // Buscar el producto y su inventario
      const producto = await Producto.findByPk(item.producto_id, {
        include: [{ model: Inventario }],
        transaction,
      })
      if (!producto) {
        await transaction.rollback()
        return res.status(404).json({
          success: false,
          message: `Producto con id ${item.producto_id} no encontrado.`,
        })
      }
      const inventario = producto.Inventario
      if (!inventario) {
        await transaction.rollback()
        return res.status(404).json({
          success: false,
          message: `Inventario no encontrado para el producto ${producto.nombre}.`,
        })
      }
      if (inventario.cantidad_actual < item.cantidad) {
        await transaction.rollback()
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para el producto ${producto.nombre}. Disponible: ${inventario.cantidad_actual}`,
        })
      }

      await inventario.update(
        {
          cantidad_actual: inventario.cantidad_actual - item.cantidad,
          estado: inventario.cantidad_actual - item.cantidad <= 0 ? "Agotado" : inventario.estado,
        },
        { transaction },
      )
    }

    // Marcar items del carrito como eliminados
    await Carrito.update(
      { is_delete: true, is_active: false },
      { where: { usuario_id, is_delete: false, is_active: true }, transaction }
    )

    await transaction.commit()

    // Crear notificaciones para administradores después de confirmar la transacción
    await crearNotificacionOrdenCreada(orden)

    return res.status(201).json({ success: true, data: orden })
  } catch (error) {
    console.error("Error al crear la orden:", error)
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

    // Guardar el estado anterior para comparar
    const estadoAnterior = orden.status

    await orden.update({ status })

    // Crear notificación solo si el estado cambió y no es "Pendiente"
    if (estadoAnterior !== status && status !== "Pendiente") {
      await crearNotificacionCambioEstado(orden, status)
    }

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
        { transaction },
      )
    }

    // Actualizar estado de la orden
    await orden.update({ status: "Cancelada" }, { transaction })

    await transaction.commit()

    // Crear notificación de cancelación
    await crearNotificacionCambioEstado(orden, "Cancelada")

    return res.status(200).json({ success: true, message: "Orden cancelada correctamente" })
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}