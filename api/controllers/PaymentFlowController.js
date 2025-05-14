import paymentFlowService from "../utils/PaymentFlowService.js"
import { Orden, Pago, MetodoPago, Usuario, Factura, Envio } from "../models/index.js"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

// Get current directory name (for ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Create a new order from cart items
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const createOrder = async (req, res, next) => {
  try {
    const { usuario_id, coupon_id } = req.body

    const orden = await paymentFlowService.createOrder(usuario_id, coupon_id)

    return res.status(201).json({ success: true, data: orden })
  } catch (error) {
    next(error)
  }
}

/**
 * Process a payment for an order
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const processPayment = async (req, res, next) => {
  try {
    const {
      orden_id,
      metodo_pago_id,
      fecha,
      numero_referencia,
      monto,
      shipping_name,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_phone,
    } = req.body

    console.log("Datos de envío recibidos:", {
      shipping_name,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_phone,
    })

    // Verify if the order exists
    const orden = await Orden.findByPk(orden_id, {
      include: [{ model: Usuario }],
    })

    if (!orden) {
      return res.status(404).json({ success: false, message: "Orden not found" })
    }

    // Verify if the payment method exists
    const metodoPago = await MetodoPago.findOne({
      where: { id: metodo_pago_id, is_delete: false, is_active: true },
    })

    if (!metodoPago) {
      return res.status(404).json({ success: false, message: "Método de pago not found" })
    }

    // Verify if comprobante was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Comprobante de pago is required" })
    }

    // Obtener la cédula del usuario
    const userDocument = orden.Usuario.documento

    // Verificar si el archivo ya está en la ubicación correcta
    let comprobante_img = req.file.path

    // Si el archivo no está en la ubicación correcta (por cédula), moverlo
    if (!req.file.path.includes(`/payments/${userDocument}/`)) {
      // Crear directorio para el usuario si no existe
      const userDir = path.join(__dirname, "..", "uploads", "payments", userDocument)
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true })
      }

      // Generar nombre de archivo con fecha
      const now = new Date()
      // Formato día-mes-año_hora-minuto
      const day = now.getDate().toString().padStart(2, "0")
      const month = (now.getMonth() + 1).toString().padStart(2, "0")
      const year = now.getFullYear()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")

      const formattedDate = `${day}-${month}-${year}_${hours}-${minutes}`
      const fileExt = path.extname(req.file.originalname)
      const newFileName = `comprobante_${formattedDate}${fileExt}`

      // Ruta completa del nuevo archivo
      const newFilePath = path.join(userDir, newFileName)

      // Mover el archivo
      fs.renameSync(req.file.path, newFilePath)

      // Actualizar la ruta del comprobante
      comprobante_img = path.relative(path.join(__dirname, ".."), newFilePath)

      console.log(`Archivo movido a: ${comprobante_img}`)
    } else {
      // Si ya está en la ubicación correcta, obtener la ruta relativa
      comprobante_img = path.relative(path.join(__dirname, ".."), req.file.path)
    }

    const paymentData = {
      orden_id,
      metodo_pago_id,
      fecha: fecha || new Date(),
      comprobante_img,
      numero_referencia,
      monto,
    }

    // Prepare shipping data if provided
    let shippingData = null
    if (shipping_name && shipping_address && shipping_city && shipping_state && shipping_phone) {
      shippingData = {
        orden_id,
        nombre_receptor: shipping_name,
        direccion: shipping_address,
        ciudad: shipping_city,
        estado: shipping_state,
        telefono: shipping_phone,
      }

      console.log("Datos de envío preparados:", shippingData)

      // Crear o actualizar directamente la información de envío
      try {
        const existingEnvio = await Envio.findOne({ where: { orden_id } })

        if (existingEnvio) {
          await existingEnvio.update(shippingData)
          console.log("Información de envío actualizada:", existingEnvio.id)
        } else {
          const newEnvio = await Envio.create(shippingData)
          console.log("Nueva información de envío creada:", newEnvio.id)
        }
      } catch (envioError) {
        console.error("Error al guardar información de envío:", envioError)
      }
    } else {
      console.log("Datos de envío incompletos, no se guardará información de envío")
    }

    const result = await paymentFlowService.processPayment(paymentData, shippingData)

    return res.status(201).json({ success: true, data: result })
  } catch (error) {
    console.error("Error en processPayment:", error)
    // If a file was uploaded, it will be handled by the error middleware
    next(error)
  }
}

/**
 * Verify a payment and update order status
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const verifyPayment = async (req, res, next) => {
  try {
    const { id } = req.params
    const { is_approved } = req.body

    // Verify if the payment exists
    const pago = await Pago.findOne({
      where: { id, is_delete: false },
      include: [{ model: Orden }],
    })

    if (!pago) {
      return res.status(404).json({ success: false, message: "Pago not found" })
    }

    const orden = await paymentFlowService.verifyPayment(id, is_approved)

    return res.status(200).json({
      success: true,
      message: is_approved ? "Pago verificado y orden completada" : "Pago rechazado y orden cancelada",
      data: orden,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Generate an invoice for a completed order
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const generateInvoice = async (req, res, next) => {
  try {
    const { orden_id } = req.body

    // Verify if the order exists
    const orden = await Orden.findOne({
      where: { id: orden_id, status: "Completa" },
    })

    if (!orden) {
      return res.status(404).json({ success: false, message: "Orden not found or not completed" })
    }

    // Check if invoice already exists
    const existingFactura = await Factura.findOne({
      where: { orden_id },
    })

    if (existingFactura) {
      return res.status(400).json({ success: false, message: "Ya existe una factura para esta orden" })
    }

    const factura = await paymentFlowService.generateInvoice(orden_id)

    return res.status(201).json({ success: true, data: factura })
  } catch (error) {
    next(error)
  }
}

/**
 * Apply a coupon to an order
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const applyCoupon = async (req, res, next) => {
  try {
    const { codigo, orden_id } = req.body
    const userId = req.user.id

    const result = await paymentFlowService.applyCoupon(codigo, orden_id, userId)

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get pending payments for admin verification
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const getPendingPayments = async (req, res, next) => {
  try {
    const pendingPayments = await Pago.findAll({
      where: { is_delete: false, is_active: true },
      include: [
        {
          model: Orden,
          where: { status: "Pendiente" },
          include: [
            {
              model: Usuario,
              attributes: ["id", "nombre", "correo", "documento", "telefono"],
            },
          ],
        },
        {
          model: MetodoPago,
          attributes: ["id", "nombre"],
        },
      ],
      order: [["fecha", "DESC"]],
    })

    return res.status(200).json({ success: true, data: pendingPayments })
  } catch (error) {
    next(error)
  }
}
