import { Factura, Orden, DetalleOrden, Usuario, Producto } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Obtener todas las facturas
export const getAllFacturas = async (req, res, next) => {
  try {
    const facturas = await Factura.findAll({
      where: { is_delete: false },
      include: [
        {
          model: Orden,
          include: [
            {
              model: Usuario,
              attributes: ["id", "nombre", "correo"],
            },
          ],
        },
      ],
      order: [["fecha_emision", "DESC"]],
    })

    return res.status(200).json({ success: true, data: facturas })
  } catch (error) {
    next(error)
  }
}

// Obtener factura por ID
export const getFacturaById = async (req, res, next) => {
  try {
    const { id } = req.params

    const factura = await Factura.findOne({
      where: { id, is_delete: false },
      include: [
        {
          model: Orden,
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
                  attributes: ["id", "codigo", "nombre", "descripcion"],
                },
              ],
            },
          ],
        },
      ],
    })

    if (!factura) {
      return res.status(404).json({ success: false, message: "Factura not found" })
    }

    return res.status(200).json({ success: true, data: factura })
  } catch (error) {
    next(error)
  }
}

// Crear una nueva factura
export const createFactura = async (req, res, next) => {
  const transaction = await sequelize.transaction()

  try {
    const { orden_id, numero_factura, fecha_emision, subtotal } = req.body

    // Verificar si la orden existe
    const orden = await Orden.findOne({
      where: { id: orden_id },
      transaction,
    })

    if (!orden) {
      await transaction.rollback()
      return res.status(404).json({ success: false, message: "Orden not found" })
    }

    // Verificar si ya existe una factura para esta orden
    const existingFactura = await Factura.findOne({
      where: { orden_id },
      transaction,
    })

    if (existingFactura) {
      await transaction.rollback()
      return res.status(400).json({ success: false, message: "Ya existe una factura para esta orden" })
    }

    // Verificar si el número de factura ya existe
    const duplicateFactura = await Factura.findOne({
      where: { numero_factura },
      transaction,
    })

    if (duplicateFactura) {
      await transaction.rollback()
      return res.status(400).json({ success: false, message: "Número de factura ya existe" })
    }

    // Crear la factura
    const factura = await Factura.create(
      {
        orden_id,
        numero_factura,
        fecha_emision: fecha_emision || new Date(),
        subtotal,
        status_factura: "Activa",
      },
      { transaction }
    )

    // Actualizar el estado de la orden a "Completa"
    await orden.update({ status: "Completa" }, { transaction })

    await transaction.commit()

    return res.status(201).json({ success: true, data: factura })
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

// Anular factura
export const anularFactura = async (req, res, next) => {
  const transaction = await sequelize.transaction()

  try {
    const { id } = req.params

    const factura = await Factura.findOne({
      where: { id, is_delete: false },
      transaction,
    })

    if (!factura) {
      await transaction.rollback()
      return res.status(404).json({ success: false, message: "Factura not found" })
    }

    if (factura.status_factura === "Anulada") {
      await transaction.rollback()
      return res.status(400).json({ success: false, message: "La factura ya está anulada" })
    }

    // Anular la factura
    await factura.update({ status_factura: "Anulada" }, { transaction })

    // Actualizar el estado de la orden a "Pendiente"
    await Orden.update(
      { status: "Pendiente" },
      {
        where: { id: factura.orden_id },
        transaction,
      }
    )

    await transaction.commit()

    return res.status(200).json({ success: true, message: "Factura anulada correctamente" })
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

// Eliminar factura (soft delete)
export const deleteFactura = async (req, res, next) => {
  try {
    const { id } = req.params

    const factura = await Factura.findOne({
      where: { id, is_delete: false },
    })

    if (!factura) {
      return res.status(404).json({ success: false, message: "Factura not found" })
    }

    await factura.update({ is_delete: true })

    return res.status(200).json({ success: true, message: "Factura deleted successfully" })
  } catch (error) {
    next(error)
  }
}