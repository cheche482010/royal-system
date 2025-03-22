// controllers/ProductoController.js
import { Producto } from "../models/index.js"
import { Op } from "sequelize"

export const getAllProductos = async (req, res, next) => {
  try {
    const productos = await Producto.findAll({
      where: { is_delete: false },
      include: [
        { model: req.models.Marca, as: 'marca' },
        { model: req.models.Categoria, as: 'categoria' },
        { model: req.models.Inventario, as: 'inventario' },
        { model: req.models.HistorialPrecio, as: 'precios' }
      ]
    })
    return res.status(200).json({ success: true, data: productos })
  } catch (error) {
    next(error)
  }
}

export const getProductoById = async (req, res, next) => {
  try {
    const { id } = req.params
    const producto = await Producto.findByPk(id, {
      where: { is_delete: false },
      include: [
        { model: req.models.Marca, as: 'marca' },
        { model: req.models.Categoria, as: 'categoria' },
        { model: req.models.Inventario, as: 'inventario' },
        { model: req.models.HistorialPrecio, as: 'precios' }
      ]
    })
    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto not found" })
    }
    return res.status(200).json({ success: true, data: producto })
  } catch (error) {
    next(error)
  }
}

export const createProducto = async (req, res, next) => {
  try {
    const {
      codigo,
      nombre,
      descripcion,
      producto_img,
      precio_unidad,
      precio_tienda,
      precio_distribuidor,
      inventario_id,
      marca_id,
      categoria_id
    } = req.body

    const existingProducto = await Producto.findOne({
      where: {
        [Op.or]: [
          { codigo },
          { nombre }
        ],
        is_delete: false
      }
    })

    if (existingProducto) {
      return res.status(400).json({
        success: false,
        message: "Product with this code or name already exists"
      })
    }

    const producto = await Producto.create({
      codigo,
      nombre,
      descripcion,
      producto_img,
      precio_unidad,
      precio_tienda,
      precio_distribuidor,
      inventario_id,
      marca_id,
      categoria_id,
      is_active: true,
      is_delete: false
    })

    return res.status(201).json({ success: true, data: producto })
  } catch (error) {
    next(error)
  }
}

export const updateProducto = async (req, res, next) => {
  try {
    const { id } = req.params
    const {
      codigo,
      nombre,
      descripcion,
      producto_img,
      precio_unidad,
      precio_tienda,
      precio_distribuidor,
      inventario_id,
      marca_id,
      categoria_id
    } = req.body

    const producto = await Producto.findByPk(id)
    if (!producto || producto.is_delete) {
      return res.status(404).json({ success: false, message: "Producto not found" })
    }

    const existingProducto = await Producto.findOne({
      where: {
        [Op.or]: [
          { codigo },
          { nombre }
        ],
        id: { [Op.ne]: id },
        is_delete: false
      }
    })

    if (existingProducto) {
      return res.status(400).json({
        success: false,
        message: "Product with this code or name already exists"
      })
    }

    await producto.update({
      codigo: codigo || producto.codigo,
      nombre: nombre || producto.nombre,
      descripcion: descripcion || producto.descripcion,
      producto_img: producto_img || producto.producto_img,
      precio_unidad: precio_unidad || producto.precio_unidad,
      precio_tienda: precio_tienda || producto.precio_tienda,
      precio_distribuidor: precio_distribuidor || producto.precio_distribuidor,
      inventario_id: inventario_id || producto.inventario_id,
      marca_id: marca_id || producto.marca_id,
      categoria_id: categoria_id || producto.categoria_id
    })

    return res.status(200).json({ success: true, data: producto })
  } catch (error) {
    next(error)
  }
}

export const deleteProducto = async (req, res, next) => {
  try {
    const { id } = req.params
    const producto = await Producto.findByPk(id)
    if (!producto || producto.is_delete) {
      return res.status(404).json({ success: false, message: "Producto not found" })
    }
    await producto.update({ is_delete: true })
    return res.status(200).json({ success: true, message: "Producto deleted successfully" })
  } catch (error) {
    next(error)
  }
}