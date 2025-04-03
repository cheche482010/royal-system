import { Pago, Orden, MetodoPago, Usuario } from "../models/index.js"
import { sequelize } from "../config/database.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { cleanupEmptyDir } from "../middleware/upload.js"

// Get current directory name (for ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Obtener todos los pagos
export const getAllPagos = async (req, res, next) => {
  try {
    const pagos = await Pago.findAll({
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
        {
          model: MetodoPago,
          attributes: ["id", "nombre"],
        },
      ],
      order: [["fecha", "DESC"]],
    })

    return res.status(200).json({ success: true, data: pagos })
  } catch (error) {
    next(error)
  }
}

// Obtener pago por ID
export const getPagoById = async (req, res, next) => {
  try {
    const { id } = req.params

    const pago = await Pago.findOne({
      where: { id, is_delete: false },
      include: [
        {
          model: Orden,
          include: [
            {
              model: Usuario,
              attributes: ["id", "nombre", "correo", "documento", "telefono"],
            },
          ],
        },
        {
          model: MetodoPago,
          attributes: ["id", "nombre", "descripcion"],
        },
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

// Obtener pagos por orden
export const getPagosByOrden = async (req, res, next) => {
  try {
    const { orden_id } = req.params

    // Verificar si la orden existe
    const orden = await Orden.findByPk(orden_id)
    if (!orden) {
      return res.status(404).json({ success: false, message: "Orden not found" })
    }

    const pagos = await Pago.findAll({
      where: { orden_id, is_delete: false },
      include: [
        {
          model: MetodoPago,
          attributes: ["id", "nombre"],
        },
      ],
      order: [["fecha", "DESC"]],
    })

    return res.status(200).json({ success: true, data: pagos })
  } catch (error) {
    next(error)
  }
}

// Crear un nuevo pago
export const createPago = async (req, res, next) => {
  try {
    const { orden_id, metodo_pago_id, fecha, numero_referencia, monto } = req.body

    // Verificar si la orden existe
    const orden = await Orden.findByPk(orden_id)
    if (!orden) {
      // Si se subió un archivo, eliminarlo
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }

      // Limpiar directorio vacío si se creó
      if (req.pagoUploadDir) {
        const pagoDir = path.join(__dirname, "..", "uploads", "pago", req.pagoUploadDir)
        cleanupEmptyDir(pagoDir)
      }

      return res.status(404).json({ success: false, message: "Orden not found" })
    }

    // Verificar si el método de pago existe
    const metodoPago = await MetodoPago.findOne({
      where: { id: metodo_pago_id, is_delete: false, is_active: true },
    })

    if (!metodoPago) {
      // Si se subió un archivo, eliminarlo
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }

      // Limpiar directorio vacío si se creó
      if (req.pagoUploadDir) {
        const pagoDir = path.join(__dirname, "..", "uploads", "pago", req.pagoUploadDir)
        cleanupEmptyDir(pagoDir)
      }

      return res.status(404).json({ success: false, message: "Método de pago not found" })
    }

    // Verificar si se subió el comprobante
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Comprobante de pago is required" })
    }

    const comprobante_img = path.relative(path.join(__dirname, ".."), req.file.path)

    const pago = await Pago.create({
      orden_id,
      metodo_pago_id,
      fecha: fecha || new Date(),
      comprobante_img,
      numero_referencia,
      monto,
    })

    return res.status(201).json({ success: true, data: pago })
  } catch (error) {
    // Si se subió un archivo, eliminarlo en caso de error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    // Limpiar directorio vacío si se creó
    if (req.pagoUploadDir) {
      const pagoDir = path.join(__dirname, "..", "uploads", "pago", req.pagoUploadDir)
      cleanupEmptyDir(pagoDir)
    }

    next(error)
  }
}

// Actualizar pago
export const updatePago = async (req, res, next) => {
  try {
    const { id } = req.params
    const { metodo_pago_id, fecha, numero_referencia, monto, is_active } = req.body

    const pago = await Pago.findOne({
      where: { id, is_delete: false },
    })

    if (!pago) {
      // Si se subió un archivo, eliminarlo
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }

      // Limpiar directorio vacío si se creó
      if (req.pagoUploadDir) {
        const pagoDir = path.join(__dirname, "..", "uploads", "pago", req.pagoUploadDir)
        cleanupEmptyDir(pagoDir)
      }

      return res.status(404).json({ success: false, message: "Pago not found" })
    }

    // Verificar si el método de pago existe
    if (metodo_pago_id) {
      const metodoPago = await MetodoPago.findOne({
        where: { id: metodo_pago_id, is_delete: false, is_active: true },
      })

      if (!metodoPago) {
        // Si se subió un archivo, eliminarlo
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path)
        }

        // Limpiar directorio vacío si se creó
        if (req.pagoUploadDir) {
          const pagoDir = path.join(__dirname, "..", "uploads", "pago", req.pagoUploadDir)
          cleanupEmptyDir(pagoDir)
        }

        return res.status(404).json({ success: false, message: "Método de pago not found" })
      }
    }

    // Manejar actualización de comprobante si se proporciona
    let comprobante_img_path = pago.comprobante_img
    if (req.file) {
      // Eliminar archivo antiguo si existe
      if (pago.comprobante_img) {
        const oldPath = path.join(__dirname, "..", pago.comprobante_img)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }
      comprobante_img_path = path.relative(path.join(__dirname, ".."), req.file.path)
    }

    await pago.update({
      metodo_pago_id: metodo_pago_id || pago.metodo_pago_id,
      fecha: fecha || pago.fecha,
      comprobante_img: comprobante_img_path,
      numero_referencia: numero_referencia !== undefined ? numero_referencia : pago.numero_referencia,
      monto: monto || pago.monto,
      is_active: is_active !== undefined ? is_active : pago.is_active,
    })

    return res.status(200).json({ success: true, data: pago })
  } catch (error) {
    // Si se subió un archivo, eliminarlo en caso de error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }

    // Limpiar directorio vacío si se creó
    if (req.pagoUploadDir) {
      const pagoDir = path.join(__dirname, "..", "uploads", "pago", req.pagoUploadDir)
      cleanupEmptyDir(pagoDir)
    }

    next(error)
  }
}

// Eliminar pago (soft delete)
export const deletePago = async (req, res, next) => {
  try {
    const { id } = req.params

    const pago = await Pago.findOne({
      where: { id, is_delete: false },
    })

    if (!pago) {
      return res.status(404).json({ success: false, message: "Pago not found" })
    }

    await pago.update({ is_delete: true, is_active: false })

    return res.status(200).json({ success: true, message: "Pago deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Eliminar pago permanentemente
export const hardDeletePago = async (req, res, next) => {
  try {
    const { id } = req.params

    const pago = await Pago.findByPk(id)

    if (!pago) {
      return res.status(404).json({ success: false, message: "Pago not found" })
    }

    // Eliminar archivo de comprobante
    if (pago.comprobante_img) {
      const comprobantePath = path.join(__dirname, "..", pago.comprobante_img)
      if (fs.existsSync(comprobantePath)) {
        fs.unlinkSync(comprobantePath)
      }
    }

    await pago.destroy()

    // Limpiar directorio vacío después de eliminar el archivo
    if (pago.comprobante_img) {
      const pagoDir = path.dirname(path.join(__dirname, "..", pago.comprobante_img))
      cleanupEmptyDir(pagoDir)
    }

    return res.status(200).json({ success: true, message: "Pago permanently deleted" })
  } catch (error) {
    next(error)
  }
}