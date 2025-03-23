import { Producto, Categoria, Marca, Inventario, HistorialPrecio } from "../models/index.js"
import { sequelize } from "../config/database.js"
import { Op } from "sequelize"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { cleanupEmptyDir } from "../middleware/upload.js"

// Get current directory name (for ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Obtener todos los productos
export const getAllProductos = async (req, res, next) => {
  try {
    const productos = await Producto.findAll({
      where: { is_delete: false },
      include: [
        {
          model: Categoria,
          attributes: ["id", "nombre", "codigo"],
        },
        {
          model: Marca,
          attributes: ["id", "nombre", "logo_img"],
        },
        {
          model: Inventario,
          attributes: ["id", "cantidad_actual", "estado"],
        },
      ],
      order: [["nombre", "ASC"]],
    })

    return res.status(200).json({ success: true, data: productos })
  } catch (error) {
    next(error)
  }
}

// Obtener producto por ID
export const getProductoById = async (req, res, next) => {
  try {
    const { id } = req.params

    const producto = await Producto.findOne({
      where: { id, is_delete: false },
      include: [
        {
          model: Categoria,
          attributes: ["id", "nombre", "codigo"],
        },
        {
          model: Marca,
          attributes: ["id", "nombre", "logo_img"],
        },
        {
          model: Inventario,
          attributes: ["id", "cantidad_actual", "cantidad_inicial", "lote", "estado", "fecha_ingreso"],
        },
      ],
    })

    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto not found" })
    }

    return res.status(200).json({ success: true, data: producto })
  } catch (error) {
    next(error)
  }
}

// Crear un nuevo producto
export const createProducto = async (req, res, next) => {
  const transaction = await sequelize.transaction()

  try {
    const {
      codigo,
      nombre,
      descripcion,
      precio_unidad,
      precio_tienda,
      precio_distribuidor,
      marca_id,
      categoria_id,
      cantidad_inicial,
      lote,
    } = req.body

    // Verificar si la categoría existe
    const categoria = await Categoria.findOne({
      where: { id: categoria_id, is_delete: false },
      transaction,
    })

    if (!categoria) {
      await transaction.rollback()
      // Si se subió un archivo, eliminarlo
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }
      return res.status(404).json({ success: false, message: "Categoría not found" })
    }

    // Verificar si la marca existe
    const marca = await Marca.findOne({
      where: { id: marca_id, is_delete: false },
      transaction,
    })

    if (!marca) {
      await transaction.rollback()
      // Si se subió un archivo, eliminarlo
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }
      return res.status(404).json({ success: false, message: "Marca not found" })
    }

    // Verificar si ya existe un producto con el mismo código
    const existingProducto = await Producto.findOne({
      where: { codigo, is_delete: false },
      transaction,
    })

    if (existingProducto) {
      await transaction.rollback()
      // Si se subió un archivo, eliminarlo
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }
      return res.status(400).json({ success: false, message: "Código de producto ya existe" })
    }

    // Verificar si se subió la imagen del producto
    if (!req.file) {
      await transaction.rollback()
      return res.status(400).json({ success: false, message: "Imagen del producto es requerida" })
    }

    // Crear inventario
    const inventario = await Inventario.create(
      {
        cantidad_inicial: cantidad_inicial || 0,
        cantidad_actual: cantidad_inicial || 0,
        lote,
        estado: cantidad_inicial > 0 ? "Disponible" : "Agotado",
        fecha_ingreso: new Date(),
      },
      { transaction }
    )

    // Crear producto
    const producto = await Producto.create(
      {
        codigo,
        nombre,
        descripcion,
        producto_img: path.relative(path.join(__dirname, ".."), req.file.path),
        precio_unidad,
        precio_tienda,
        precio_distribuidor,
        inventario_id: inventario.id,
        marca_id,
        categoria_id,
      },
      { transaction }
    )

    // Actualizar inventario con el ID del producto
    await inventario.update({ producto_id: producto.id }, { transaction })

    // Crear historial de precios
    await HistorialPrecio.create(
      {
        producto_id: producto.id,
        precio_unidad,
        precio_tienda,
        precio_distribuidor,
        fecha_update: new Date(),
      },
      { transaction }
    )

    await transaction.commit()

    return res.status(201).json({ success: true, data: producto })
  } catch (error) {
    await transaction.rollback()
    // Si se subió un archivo, eliminarlo en caso de error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    next(error)
  }
}

// Actualizar producto
export const updateProducto = async (req, res, next) => {
  const transaction = await sequelize.transaction()

  try {
    const { id } = req.params
    const {
      codigo,
      nombre,
      descripcion,
      precio_unidad,
      precio_tienda,
      precio_distribuidor,
      marca_id,
      categoria_id,
      is_active,
    } = req.body

    const producto = await Producto.findOne({
      where: { id, is_delete: false },
      transaction,
    })

    if (!producto) {
      await transaction.rollback()
      // Si se subió un archivo, eliminarlo
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path)
      }
      return res.status(404).json({ success: false, message: "Producto not found" })
    }

    // Verificar si el nuevo código ya existe en otro producto
    if (codigo && codigo !== producto.codigo) {
      const existingProducto = await Producto.findOne({
        where: { codigo, id: { [Op.ne]: id }, is_delete: false },
        transaction,
      })

      if (existingProducto) {
        await transaction.rollback()
        // Si se subió un archivo, eliminarlo
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path)
        }
        return res.status(400).json({ success: false, message: "Código de producto ya existe" })
      }
    }

    // Verificar si la categoría existe
    if (categoria_id) {
      const categoria = await Categoria.findOne({
        where: { id: categoria_id, is_delete: false },
        transaction,
      })

      if (!categoria) {
        await transaction.rollback()
        // Si se subió un archivo, eliminarlo
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path)
        }
        return res.status(404).json({ success: false, message: "Categoría not found" })
      }
    }

    // Verificar si la marca existe
    if (marca_id) {
      const marca = await Marca.findOne({
        where: { id: marca_id, is_delete: false },
        transaction,
      })

      if (!marca) {
        await transaction.rollback()
        // Si se subió un archivo, eliminarlo
        if (req.file && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path)
        }
        return res.status(404).json({ success: false, message: "Marca not found" })
      }
    }

    // Manejar actualización de imagen si se proporciona
    let producto_img_path = producto.producto_img
    if (req.file) {
      // Eliminar archivo antiguo si existe
      if (producto.producto_img) {
        const oldPath = path.join(__dirname, "..", producto.producto_img)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }
      producto_img_path = path.relative(path.join(__dirname, ".."), req.file.path)
    }

    // Verificar si hay cambios en los precios
    const preciosActualizados =
      (precio_unidad && precio_unidad != producto.precio_unidad) ||
      (precio_tienda && precio_tienda != producto.precio_tienda) ||
      (precio_distribuidor && precio_distribuidor != producto.precio_distribuidor)

    // Actualizar producto
    await producto.update(
      {
        codigo: codigo || producto.codigo,
        nombre: nombre || producto.nombre,
        descripcion: descripcion || producto.descripcion,
        producto_img: producto_img_path,
        precio_unidad: precio_unidad || producto.precio_unidad,
        precio_tienda: precio_tienda || producto.precio_tienda,
        precio_distribuidor: precio_distribuidor || producto.precio_distribuidor,
        marca_id: marca_id || producto.marca_id,
        categoria_id: categoria_id || producto.categoria_id,
        is_active: is_active !== undefined ? is_active : producto.is_active,
      },
      { transaction }
    )

    // Si se actualizaron los precios, crear un nuevo registro en el historial
    if (preciosActualizados) {
      await HistorialPrecio.create(
        {
          producto_id: producto.id,
          precio_unidad: precio_unidad || producto.precio_unidad,
          precio_tienda: precio_tienda || producto.precio_tienda,
          precio_distribuidor: precio_distribuidor || producto.precio_distribuidor,
          fecha_update: new Date(),
        },
        { transaction }
      )
    }

    await transaction.commit()

    return res.status(200).json({ success: true, data: producto })
  } catch (error) {
    await transaction.rollback()
    // Si se subió un archivo, eliminarlo en caso de error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    next(error)
  }
}

// Eliminar producto (soft delete)
export const deleteProducto = async (req, res, next) => {
  try {
    const { id } = req.params

    const producto = await Producto.findOne({
      where: { id, is_delete: false },
    })

    if (!producto) {
      return res.status(404).json({ success: false, message: "Producto not found" })
    }

    await producto.update({ is_delete: true, is_active: false })

    return res.status(200).json({ success: true, message: "Producto deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Buscar productos
export const searchProductos = async (req, res, next) => {
  try {
    const { query, categoria_id, marca_id } = req.query

    const whereClause = {
      is_delete: false,
      is_active: true,
    }

    if (query) {
      whereClause[Op.or] = [
        { codigo: { [Op.like]: `%${query}%` } },
        { nombre: { [Op.like]: `%${query}%` } },
        { descripcion: { [Op.like]: `%${query}%` } },
      ]
    }

    if (categoria_id) {
      whereClause.categoria_id = categoria_id
    }

    if (marca_id) {
      whereClause.marca_id = marca_id
    }

    const productos = await Producto.findAll({
      where: whereClause,
      include: [
        {
          model: Categoria,
          attributes: ["id", "nombre", "codigo"],
        },
        {
          model: Marca,
          attributes: ["id", "nombre", "logo_img"],
        },
        {
          model: Inventario,
          attributes: ["id", "cantidad_actual", "estado"],
        },
      ],
      order: [["nombre", "ASC"]],
    })

    return res.status(200).json({ success: true, data: productos })
  } catch (error) {
    next(error)
  }
}