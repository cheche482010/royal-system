import { Pago, PrecioUsuario, Usuario, Precio, Producto } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Get all pagos
export const getAllPagos = async (req, res, next) => {
  try {
    // Using Sequelize ORM with associations
    const pagos = await Pago.findAll({
      where: { is_delete: false },
      include: [
        {
          model: PrecioUsuario,
          include: [
            { model: Usuario, attributes: ["id", "nombre", "rif_cedula"] },
            { model: Precio, attributes: ["id", "nombre_precio", "precio_unidad"] },
          ],
        },
        { model: Producto, attributes: ["id", "codigo", "nombre", "presentacion"] },
      ],
    })

    return res.status(200).json({ success: true, data: pagos })
  } catch (error) {
    next(error)
  }
}

// Get pago by ID
export const getPagoById = async (req, res, next) => {
  try {
    const { id } = req.params

    // Using Sequelize ORM with associations
    const pago = await Pago.findOne({
      where: {
        id,
        is_delete: false,
      },
      include: [
        {
          model: PrecioUsuario,
          include: [
            { model: Usuario, attributes: ["id", "nombre", "rif_cedula"] },
            { model: Precio, attributes: ["id", "nombre_precio", "precio_unidad"] },
          ],
        },
        { model: Producto, attributes: ["id", "codigo", "nombre", "presentacion"] },
      ],
    })

    if (!pago) {
      return res.status(404).json({ success: false, message: "Pago not found" })
    }

    return res.status(200).json({ success: true, data: pago })
  } catch (error) {
    next(error)
  }
}

// Get pagos by usuario_id
export const getPagosByUsuarioId = async (req, res, next) => {
  try {
    const { usuario_id } = req.params

    // Using raw SQL query with joins to get pagos for a specific usuario
    const pagos = await sequelize.query(
      `
      SELECT p.*, pu.usuario_id, pu.precio_id, pr.nombre AS producto_nombre, pr.codigo AS producto_codigo
      FROM pagos p
      JOIN precio_usuario pu ON p.precio_usuario_id = pu.id
      JOIN producto pr ON p.producto_id = pr.id
      WHERE pu.usuario_id = ? AND p.is_delete = false
      ORDER BY p.fecha DESC
    `,
      {
        replacements: [usuario_id],
        type: sequelize.QueryTypes.SELECT,
      },
    )

    return res.status(200).json({ success: true, data: pagos })
  } catch (error) {
    next(error)
  }
}

// Create a new pago
export const createPago = async (req, res, next) => {
  try {
    const { precio_usuario_id, producto_id, fecha, referencia, numero_referencia, monto } = req.body

    // Check if both precio_usuario and producto exist
    const precioUsuario = await PrecioUsuario.findByPk(precio_usuario_id)
    const producto = await Producto.findByPk(producto_id)

    if (!precioUsuario || precioUsuario.is_delete) {
      return res.status(404).json({ success: false, message: "Precio-Usuario relationship not found" })
    }

    if (!producto || producto.is_delete) {
      return res.status(404).json({ success: false, message: "Producto not found" })
    }

    // Using ORM method for creation
    const pago = await Pago.create({
      precio_usuario_id,
      producto_id,
      fecha: fecha || new Date(),
      referencia,
      numero_referencia,
      monto,
    })

    // Fetch the created pago with associations
    const result = await Pago.findByPk(pago.id, {
      include: [
        {
          model: PrecioUsuario,
          include: [
            { model: Usuario, attributes: ["id", "nombre", "rif_cedula"] },
            { model: Precio, attributes: ["id", "nombre_precio", "precio_unidad"] },
          ],
        },
        { model: Producto, attributes: ["id", "codigo", "nombre", "presentacion"] },
      ],
    })

    return res.status(201).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

// Update pago
export const updatePago = async (req, res, next) => {
  try {
    const { id } = req.params
    const { precio_usuario_id, producto_id, fecha, referencia, numero_referencia, monto } = req.body

    const pago = await Pago.findByPk(id)

    if (!pago || pago.is_delete) {
      return res.status(404).json({ success: false, message: "Pago not found" })
    }

    // If updating foreign keys, check if the new entities exist
    if (precio_usuario_id) {
      const precioUsuario = await PrecioUsuario.findByPk(precio_usuario_id)
      if (!precioUsuario || precioUsuario.is_delete) {
        return res.status(404).json({ success: false, message: "Precio-Usuario relationship not found" })
      }
    }

    if (producto_id) {
      const producto = await Producto.findByPk(producto_id)
      if (!producto || producto.is_delete) {
        return res.status(404).json({ success: false, message: "Producto not found" })
      }
    }

    // Using ORM method for update
    await pago.update({
      precio_usuario_id: precio_usuario_id || pago.precio_usuario_id,
      producto_id: producto_id || pago.producto_id,
      fecha: fecha || pago.fecha,
      referencia: referencia !== undefined ? referencia : pago.referencia,
      numero_referencia: numero_referencia !== undefined ? numero_referencia : pago.numero_referencia,
      monto: monto || pago.monto,
    })

    // Fetch the updated pago with associations
    const result = await Pago.findByPk(pago.id, {
      include: [
        {
          model: PrecioUsuario,
          include: [
            { model: Usuario, attributes: ["id", "nombre", "rif_cedula"] },
            { model: Precio, attributes: ["id", "nombre_precio", "precio_unidad"] },
          ],
        },
        { model: Producto, attributes: ["id", "codigo", "nombre", "presentacion"] },
      ],
    })

    return res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

// Soft delete pago
export const deletePago = async (req, res, next) => {
  try {
    const { id } = req.params

    const pago = await Pago.findByPk(id)

    if (!pago || pago.is_delete) {
      return res.status(404).json({ success: false, message: "Pago not found" })
    }

    // Soft delete by setting is_delete to true
    await pago.update({ is_delete: true })

    return res.status(200).json({ success: true, message: "Pago deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Hard delete pago (for admin use only)
export const hardDeletePago = async (req, res, next) => {
  try {
    const { id } = req.params

    const pago = await Pago.findByPk(id)

    if (!pago) {
      return res.status(404).json({ success: false, message: "Pago not found" })
    }

    // Using raw SQL query with parameterized query to prevent SQL injection
    await sequelize.query("DELETE FROM pagos WHERE id = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
    })

    return res.status(200).json({ success: true, message: "Pago permanently deleted" })
  } catch (error) {
    next(error)
  }
}

