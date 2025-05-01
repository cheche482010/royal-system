import { sequelize } from "../config/database.js"
import {
  Orden,
  DetalleOrden,
  Pago,
  Factura,
  Producto,
  Inventario,
  Carrito,
  CarritoProducto,
  Coupon,
  CouponUsado,
  Usuario,
  MetodoPago,
  Envio
} from "../models/index.js"
import { Op } from "sequelize"

/**
 * Service to handle the complete payment flow
 */
class PaymentFlowService {
  /**
   * Create a new order from cart items
   * @param {number} userId - User ID
   * @param {number} couponId - Optional coupon ID
   * @returns {Promise<Object>} - Created order
   */
  async createOrder(userId, couponId = null) {
    const transaction = await sequelize.transaction()

    try {
      // Verify if the user exists
      const usuario = await Usuario.findByPk(userId, { transaction })
      if (!usuario) {
        await transaction.rollback()
        throw new Error("Usuario no encontrado")
      }

      // Get cart items
      const carrito = await Carrito.findOne({
        where: { usuario_id: userId, is_delete: false, is_active: true },
        transaction
      })

      if (!carrito) {
        await transaction.rollback()
        throw new Error("Carrito no encontrado")
      }

      const carritoItems = await CarritoProducto.findAll({
        where: { carrito_id: carrito.id, is_delete: false, is_active: true },
        include: [
          {
            model: Producto,
            include: [{ model: Inventario }]
          }
        ],
        transaction
      })

      if (carritoItems.length === 0) {
        await transaction.rollback()
        throw new Error("El carrito está vacío")
      }

      // Calculate total amount
      let montoTotal = 0
      for (const item of carritoItems) {
        montoTotal += item.Producto.precio_unidad * item.cantidad
      }

      // Apply coupon if provided
      let couponDiscount = 0
      let coupon = null
      if (couponId) {
        coupon = await Coupon.findOne({
          where: {
            id: couponId,
            is_active: true,
            fecha_inicio: { [Op.lte]: new Date() },
            [Op.or]: [
              { fecha_fin: null },
              { fecha_fin: { [Op.gte]: new Date() } }
            ],
            [Op.or]: [
              { max_usos: null },
              { max_usos: { [Op.gt]: sequelize.col("usos_actuales") } }
            ]
          },
          transaction
        })

        if (!coupon) {
          await transaction.rollback()
          throw new Error("Cupón no válido o caducado")
        }

        // Check if user already used this coupon
        const couponUsed = await CouponUsado.findOne({
          where: {
            cupon_id: couponId,
            usuario_id: userId
          },
          transaction
        })

        if (couponUsed) {
          await transaction.rollback()
          throw new Error("Ya has utilizado este cupón")
        }

        // Calculate discount
        if (coupon.tipo_descuento === "porcentaje") {
          const porcentaje = parseFloat(coupon.descuento) / 100
          couponDiscount = montoTotal * porcentaje
        } else {
          couponDiscount = parseFloat(coupon.descuento.replace("$", ""))
        }

        montoTotal -= couponDiscount
      }

      // Create the order
      const orden = await Orden.create(
        {
          usuario_id: userId,
          monto_total: montoTotal,
          status: "Pendiente"
        },
        { transaction }
      )

      // Create order details
      for (const item of carritoItems) {
        await DetalleOrden.create(
          {
            orden_id: orden.id,
            producto_id: item.Producto.id,
            cantidad: item.cantidad,
            precio: item.Producto.precio_unidad
          },
          { transaction }
        )
      }

      // If coupon was applied, register its use
      if (coupon) {
        await CouponUsado.create(
          {
            cupon_id: coupon.id,
            usuario_id: userId,
            orden_id: orden.id
          },
          { transaction }
        )

        // Increment coupon usage counter
        await coupon.increment("usos_actuales", { transaction })
      }

      await transaction.commit()
      return orden
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  /**
   * Process a payment for an order
   * @param {Object} paymentData - Payment data
   * @param {Object} shippingData - Optional shipping data
   * @returns {Promise<Object>} - Created payment and shipping info
   */
  async processPayment(paymentData, shippingData = null) {
    const transaction = await sequelize.transaction()

    try {
      const { orden_id, metodo_pago_id, fecha, comprobante_img, numero_referencia, monto } = paymentData

      // Verify if the order exists
      const orden = await Orden.findByPk(orden_id, { transaction })
      if (!orden) {
        await transaction.rollback()
        throw new Error("Orden no encontrada")
      }

      // Verify if the payment method exists
      const metodoPago = await MetodoPago.findOne({
        where: { id: metodo_pago_id, is_delete: false, is_active: true },
        transaction
      })

      if (!metodoPago) {
        await transaction.rollback()
        throw new Error("Método de pago no encontrado")
      }

      // Create the payment
      const pago = await Pago.create(
        {
          orden_id,
          metodo_pago_id,
          fecha: fecha || new Date(),
          comprobante_img,
          numero_referencia,
          monto
        },
        { transaction }
      )

      // Create shipping information if provided
      let envio = null
      if (shippingData) {
        // Check if shipping info already exists for this order
        const existingEnvio = await Envio.findOne({
          where: { orden_id },
          transaction
        })

        if (existingEnvio) {
          await transaction.rollback()
          throw new Error("Ya existe información de envío para esta orden")
        }

        envio = await Envio.create(shippingData, { transaction })
      }

      // Update inventory
      const detallesOrden = await DetalleOrden.findAll({
        where: { orden_id },
        include: [
          {
            model: Producto,
            include: [{ model: Inventario }]
          }
        ],
        transaction
      })

      for (const detalle of detallesOrden) {
        const inventario = detalle.Producto.Inventario
        if (inventario.cantidad_actual < detalle.cantidad) {
          await transaction.rollback()
          throw new Error(`Inventario insuficiente para el producto ${detalle.Producto.nombre}. Disponible: ${inventario.cantidad_actual}`)
        }

        await inventario.update(
          {
            cantidad_actual: inventario.cantidad_actual - detalle.cantidad,
            estado: inventario.cantidad_actual - detalle.cantidad <= 0 ? "Agotado" : inventario.estado
          },
          { transaction }
        )
      }

      // Mark cart items as deleted
      const carrito = await Carrito.findOne({
        where: { usuario_id: orden.usuario_id, is_delete: false, is_active: true },
        transaction
      })

      if (carrito) {
        const carritoItems = await CarritoProducto.findAll({
          where: { carrito_id: carrito.id, is_delete: false, is_active: true },
          transaction
        })

        for (const item of carritoItems) {
          await item.update({ is_delete: true, is_active: false }, { transaction })
        }
      }

      await transaction.commit()
      return { pago, envio }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  /**
   * Verify a payment and update order status
   * @param {number} pagoId - Payment ID
   * @param {boolean} isApproved - Whether the payment is approved
   * @returns {Promise<Object>} - Updated order
   */
  async verifyPayment(pagoId, isApproved) {
    const transaction = await sequelize.transaction()

    try {
      // Find the payment
      const pago = await Pago.findOne({
        where: { id: pagoId, is_delete: false },
        include: [{ model: Orden }],
        transaction
      })

      if (!pago) {
        await transaction.rollback()
        throw new Error("Pago no encontrado")
      }

      const orden = pago.Orden

      if (isApproved) {
        // Update order status to "Completa"
        await orden.update({ status: "Completa" }, { transaction })

        // Generate invoice
        const numeroFactura = `F-${Date.now()}-${orden.id}`
        await Factura.create(
          {
            orden_id: orden.id,
            numero_factura: numeroFactura,
            fecha_emision: new Date(),
            subtotal: orden.monto_total,
            status_factura: "Activa"
          },
          { transaction }
        )
      } else {
        // Update order status to "Cancelada"
        await orden.update({ status: "Cancelada" }, { transaction })

        // Restore inventory
        const detallesOrden = await DetalleOrden.findAll({
          where: { orden_id: orden.id },
          include: [
            {
              model: Producto,
              include: [{ model: Inventario }]
            }
          ],
          transaction
        })

        for (const detalle of detallesOrden) {
          const inventario = detalle.Producto.Inventario
          await inventario.update(
            {
              cantidad_actual: inventario.cantidad_actual + detalle.cantidad,
              estado: "Disponible"
            },
            { transaction }
          )
        }
      }

      await transaction.commit()
      return orden
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  /**
   * Generate an invoice for a completed order
   * @param {number} ordenId - Order ID
   * @returns {Promise<Object>} - Created invoice
   */
  async generateInvoice(ordenId) {
    const transaction = await sequelize.transaction()

    try {
      // Verify if the order exists and is completed
      const orden = await Orden.findOne({
        where: { id: ordenId, status: "Completa" },
        transaction
      })

      if (!orden) {
        await transaction.rollback()
        throw new Error("Orden no encontrada o no está completa")
      }

      // Check if invoice already exists
      const existingFactura = await Factura.findOne({
        where: { orden_id: ordenId },
        transaction
      })

      if (existingFactura) {
        await transaction.rollback()
        throw new Error("Ya existe una factura para esta orden")
      }

      // Generate invoice number
      const numeroFactura = `F-${Date.now()}-${ordenId}`

      // Create the invoice
      const factura = await Factura.create(
        {
          orden_id: ordenId,
          numero_factura: numeroFactura,
          fecha_emision: new Date(),
          subtotal: orden.monto_total,
          status_factura: "Activa"
        },
        { transaction }
      )

      await transaction.commit()
      return factura
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  /**
   * Apply a coupon to an order
   * @param {string} couponCode - Coupon code
   * @param {number} ordenId - Order ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - Updated order with discount
   */
  async applyCoupon(couponCode, ordenId, userId) {
    const transaction = await sequelize.transaction()

    try {
      // Verify if the order exists
      const orden = await Orden.findOne({
        where: { id: ordenId, usuario_id: userId },
        transaction
      })

      if (!orden) {
        await transaction.rollback()
        throw new Error("Orden no encontrada")
      }

      // Verify if the coupon is valid
      const coupon = await Coupon.findOne({
        where: {
          codigo: couponCode,
          is_active: true,
          fecha_inicio: { [Op.lte]: new Date() },
          [Op.or]: [
            { fecha_fin: null },
            { fecha_fin: { [Op.gte]: new Date() } }
          ],
          [Op.or]: [
            { max_usos: null },
            { max_usos: { [Op.gt]: sequelize.col("usos_actuales") } }
          ]
        },
        transaction
      })

      if (!coupon) {
        await transaction.rollback()
        throw new Error("Cupón no válido o caducado")
      }

      // Check if user already used this coupon
      const couponUsed = await CouponUsado.findOne({
        where: {
          cupon_id: coupon.id,
          usuario_id: userId
        },
        transaction
      })

      if (couponUsed) {
        await transaction.rollback()
        throw new Error("Ya has utilizado este cupón")
      }

      // Calculate discount
      let descuento = 0
      if (coupon.tipo_descuento === "porcentaje") {
        const porcentaje = parseFloat(coupon.descuento) / 100
        descuento = orden.monto_total * porcentaje
      } else {
        descuento = parseFloat(coupon.descuento.replace("$", ""))
      }

      const nuevoTotal = orden.monto_total - descuento

      // Register coupon usage
      await CouponUsado.create(
        {
          cupon_id: coupon.id,
          usuario_id: userId,
          orden_id: ordenId
        },
        { transaction }
      )

      // Increment coupon usage counter
      await coupon.increment("usos_actuales", { transaction })

      // Update order total
      await orden.update({ monto_total: nuevoTotal }, { transaction })

      await transaction.commit()
      return {
        orden,
        descuento,
        nuevoTotal,
        coupon
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}

export default new PaymentFlowService()