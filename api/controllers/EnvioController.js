import { Envio, Orden } from "../models/index.js"

// Obtener todos los envíos
export const getAllEnvios = async (req, res, next) => {
  try {
    const envios = await Envio.findAll({
      where: { is_delete: false },
      include: [
        {
          model: Orden,
          attributes: ["id", "usuario_id", "monto_total", "status"]
        }
      ]
    })

    return res.status(200).json({ success: true, data: envios })
  } catch (error) {
    next(error)
  }
}

// Obtener envío por ID
export const getEnvioById = async (req, res, next) => {
  try {
    const { id } = req.params

    const envio = await Envio.findOne({
      where: { id, is_delete: false },
      include: [
        {
          model: Orden,
          attributes: ["id", "usuario_id", "monto_total", "status"]
        }
      ]
    })

    if (!envio) {
      return res.status(404).json({ success: false, message: "Envío not found" })
    }

    return res.status(200).json({ success: true, data: envio })
  } catch (error) {
    next(error)
  }
}

// Obtener envío por orden ID
export const getEnvioByOrdenId = async (req, res, next) => {
  try {
    const { orden_id } = req.params

    // Verificar si la orden existe
    const orden = await Orden.findByPk(orden_id)
    if (!orden) {
      return res.status(404).json({ success: false, message: "Orden not found" })
    }

    const envio = await Envio.findOne({
      where: { orden_id, is_delete: false }
    })

    if (!envio) {
      return res.status(404).json({ success: false, message: "Envío not found for this order" })
    }

    return res.status(200).json({ success: true, data: envio })
  } catch (error) {
    next(error)
  }
}

// Crear un nuevo envío
export const createEnvio = async (req, res, next) => {
  try {
    const { 
      orden_id, 
      nombre_receptor, 
      direccion, 
      ciudad, 
      estado, 
      telefono 
    } = req.body

    // Verificar si la orden existe
    const orden = await Orden.findByPk(orden_id)
    if (!orden) {
      return res.status(404).json({ success: false, message: "Orden not found" })
    }

    // Verificar si ya existe un envío para esta orden
    const existingEnvio = await Envio.findOne({ where: { orden_id } })
    if (existingEnvio) {
      return res.status(400).json({ 
        success: false, 
        message: "Ya existe información de envío para esta orden" 
      })
    }

    const envio = await Envio.create({
      orden_id,
      nombre_receptor,
      direccion,
      ciudad,
      estado,
      telefono
    })

    return res.status(201).json({ success: true, data: envio })
  } catch (error) {
    next(error)
  }
}

// Actualizar envío
export const updateEnvio = async (req, res, next) => {
  try {
    const { id } = req.params
    const { 
      nombre_receptor, 
      direccion, 
      ciudad, 
      estado, 
      telefono,
      is_active 
    } = req.body

    const envio = await Envio.findOne({
      where: { id, is_delete: false }
    })

    if (!envio) {
      return res.status(404).json({ success: false, message: "Envío not found" })
    }

    await envio.update({
      nombre_receptor: nombre_receptor || envio.nombre_receptor,
      direccion: direccion || envio.direccion,
      ciudad: ciudad || envio.ciudad,
      estado: estado || envio.estado,
      telefono: telefono || envio.telefono,
      is_active: is_active !== undefined ? is_active : envio.is_active
    })

    return res.status(200).json({ success: true, data: envio })
  } catch (error) {
    next(error)
  }
}

// Eliminar envío (soft delete)
export const deleteEnvio = async (req, res, next) => {
  try {
    const { id } = req.params

    const envio = await Envio.findOne({
      where: { id, is_delete: false }
    })

    if (!envio) {
      return res.status(404).json({ success: false, message: "Envío not found" })
    }

    await envio.update({ is_delete: true, is_active: false })

    return res.status(200).json({ success: true, message: "Envío deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Eliminar envío permanentemente
export const hardDeleteEnvio = async (req, res, next) => {
  try {
    const { id } = req.params

    const envio = await Envio.findByPk(id)

    if (!envio) {
      return res.status(404).json({ success: false, message: "Envío not found" })
    }

    await envio.destroy()

    return res.status(200).json({ success: true, message: "Envío permanently deleted" })
  } catch (error) {
    next(error)
  }
}