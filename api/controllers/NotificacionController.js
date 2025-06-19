import { Notificacion, Usuario, Orden } from "../models/index.js"

// Obtener todas las notificaciones de un usuario
export const getNotificacionesByUsuario = async (req, res, next) => {
  try {
    const { usuario_id } = req.params
    const { leida } = req.query

    const whereClause = { usuario_id }
    if (leida !== undefined) {
      whereClause.leida = leida === "true"
    }

    const notificaciones = await Notificacion.findAll({
      where: whereClause,
      include: [
        {
          model: Orden,
          attributes: ["id", "status", "is_active", "is_delete"],
        },
      ],
      order: [["created_at", "DESC"]],
    })

    return res.status(200).json({ success: true, data: notificaciones })
  } catch (error) {
    console.error("Error al obtener notificaciones:", error)
    next(error)
  }
}

// Marcar notificación como leída
export const marcarComoLeida = async (req, res, next) => {
  try {
    const { id } = req.params

    const notificacion = await Notificacion.findByPk(id)

    if (!notificacion) {
      return res.status(404).json({ success: false, message: "Notificación no encontrada" })
    }

    await notificacion.update({ leida: true })

    return res.status(200).json({ success: true, data: notificacion })
  } catch (error) {
    next(error)
  }
}

// Marcar todas las notificaciones de un usuario como leídas
export const marcarTodasComoLeidas = async (req, res, next) => {
  try {
    const { usuario_id } = req.params

    await Notificacion.update({ leida: true }, { where: { usuario_id, leida: false } })

    return res.status(200).json({ success: true, message: "Todas las notificaciones marcadas como leídas" })
  } catch (error) {
    next(error)
  }
}

// Obtener conteo de notificaciones no leídas
export const getConteoNoLeidas = async (req, res, next) => {
  try {
    const { usuario_id } = req.params

    const conteo = await Notificacion.count({
      where: { usuario_id, leida: false },
    })

    return res.status(200).json({ success: true, data: { conteo } })
  } catch (error) {
    next(error)
  }
}

// Crear notificación para nueva orden (notificar a admins)
export const crearNotificacionOrdenCreada = async (orden) => {
  try {
    // Obtener todos los usuarios admin
    const admins = await Usuario.findAll({
      where: { id: orden.usuario_id, is_active: true, is_delete: false },
    })

    // Crear notificación para cada admin
    const notificaciones = admins.map((admin) => ({
      usuario_id: admin.id,
      orden_id: orden.id,
      tipo: "ORDEN_CREADA",
      titulo: "Nueva Orden Pendiente",
      mensaje: `Se ha creado una nueva orden #${String(orden.id).padStart(8, "0")} por un monto de $${orden.monto_total}. Requiere verificación de pago.`,
    })) 
    
    await Notificacion.bulkCreate(notificaciones)
    console.log(`Notificaciones creadas para ${admins.length} administradores`)
  } catch (error) {
    console.error("Error al crear notificaciones para orden:", error)
  }
}

// Crear notificación para cambio de estado de orden
export const crearNotificacionCambioEstado = async (orden, nuevoEstado) => {
  try {
    let tipo, titulo, mensaje

    switch (nuevoEstado) {
      case "Completa":
        tipo = "ORDEN_COMPLETADA"
        titulo = "Orden Completada"
        mensaje = `Tu orden #${orden.id} ha sido completada exitosamente. El pago ha sido verificado y tu pedido está siendo procesado.`
        break
      case "Cancelada":
        tipo = "ORDEN_CANCELADA"
        titulo = "Orden Cancelada"
        mensaje = `Tu orden #${orden.id} ha sido cancelada. Si tienes dudas, contacta con nuestro equipo de soporte.`
        break
      default:
        return
    }

    await Notificacion.create({
      usuario_id: orden.usuario_id,
      orden_id: orden.id,
      tipo,
      titulo,
      mensaje,
    })

    console.log(`Notificación de ${tipo} creada para usuario ${orden.usuario_id}`)
  } catch (error) {
    console.error("Error al crear notificación de cambio de estado:", error)
  }
}

// Eliminar notificación
export const eliminarNotificacion = async (req, res, next) => {
  try {
    const { id } = req.params

    const notificacion = await Notificacion.findByPk(id)

    if (!notificacion) {
      return res.status(404).json({ success: false, message: "Notificación no encontrada" })
    }

    await notificacion.destroy()

    return res.status(200).json({ success: true, message: "Notificación eliminada correctamente" })
  } catch (error) {
    next(error)
  }
}
