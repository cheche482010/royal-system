import { Usuario } from "../models/index.js"
import { sequelize } from "../config/database.js"
import { Op } from "sequelize"
import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { cleanupEmptyDir } from "../middleware/upload.js"

// Get current directory name (for ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get all usuarios
export const getAllUsuarios = async (req, res, next) => {
  try {
    // Using raw SQL query with Sequelize
    const usuarios = await sequelize.query("SELECT * FROM usuarios WHERE is_delete = false", {
      type: sequelize.QueryTypes.SELECT,
    })

    return res.status(200).json({ success: true, data: usuarios })
  } catch (error) {
    next(error)
  }
}

// Get usuario by ID
export const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params

    // Using raw SQL query with parameterized query to prevent SQL injection
    const [usuario] = await sequelize.query("SELECT * FROM usuarios WHERE id = ? AND is_delete = false", {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    })

    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    return res.status(200).json({ success: true, data: usuario })
  } catch (error) {
    next(error)
  }
}

// Create a new usuario
export const createUsuario = async (req, res, next) => {
  try {
    console.log("Request body:", req.body)
    console.log("Request files:", req.files)

    const {
      documento,
      nombre,
      direccion,
      correo,
      telefono,
      user_password,
      role = "Customer",
      is_active = true,
      is_delete = false,
    } = req.body

    // Check if usuario with same documento or correo already exists
    const existingUsuario = await Usuario.findOne({
      where: {
        [Op.or]: [{ documento }, { correo }],
        is_delete: false,
      },
    })

    if (existingUsuario) {
      // If files were uploaded, delete them since we're not creating the user
      if (req.files) {
        if (req.files.documento_img) {
          fs.unlinkSync(req.files.documento_img[0].path)
        }
        if (req.files.registro_mercantil_img) {
          fs.unlinkSync(req.files.registro_mercantil_img[0].path)
        }
      }

      // Clean up empty directory if it was created
      if (req.userUploadDir) {
        const userDir = path.join(__dirname, "..", "uploads", "user", req.userUploadDir)
        cleanupEmptyDir(userDir)
      }

      return res.status(400).json({
        success: false,
        message: "Usuario with this documento or email already exists",
      })
    }

    // Get file paths from multer
    const documento_img = req.files && req.files.documento_img ? req.files.documento_img[0].path : null
    const registro_mercantil_img =
      req.files && req.files.registro_mercantil_img ? req.files.registro_mercantil_img[0].path : null

    if (!documento_img || !registro_mercantil_img) {
      // Clean up any uploaded files
      if (documento_img && fs.existsSync(documento_img)) {
        fs.unlinkSync(documento_img)
      }
      if (registro_mercantil_img && fs.existsSync(registro_mercantil_img)) {
        fs.unlinkSync(registro_mercantil_img)
      }

      // Clean up empty directory if it was created
      if (req.userUploadDir) {
        const userDir = path.join(__dirname, "..", "uploads", "user", req.userUploadDir)
        cleanupEmptyDir(userDir)
      }

      return res.status(400).json({
        success: false,
        message: "Both documento_img and registro_mercantil_img files are required",
      })
    }

    // Generate token
    const token = jwt.sign({ correo }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    })

    // Using ORM method for creation
    const usuario = await Usuario.create({
      documento,
      documento_img: path.relative(path.join(__dirname, ".."), documento_img),
      nombre,
      direccion,
      registro_mercantil_img: path.relative(path.join(__dirname, ".."), registro_mercantil_img),
      correo,
      telefono,
      user_password,
      role,
      token,
      is_active,
      is_delete,
    })

    return res.status(201).json({
      success: true,
      data: {
        id: usuario.id,
        documento: usuario.documento,
        nombre: usuario.nombre,
        correo: usuario.correo,
        role: usuario.role,
      },
      token,
    })
  } catch (error) {
    console.error("Error in createUsuario:", error)

    // If files were uploaded, delete them on error
    if (req.files) {
      if (req.files.documento_img && fs.existsSync(req.files.documento_img[0].path)) {
        fs.unlinkSync(req.files.documento_img[0].path)
      }
      if (req.files.registro_mercantil_img && fs.existsSync(req.files.registro_mercantil_img[0].path)) {
        fs.unlinkSync(req.files.registro_mercantil_img[0].path)
      }
    }

    // Clean up empty directory if it was created
    if (req.userUploadDir) {
      const userDir = path.join(__dirname, "..", "uploads", "user", req.userUploadDir)
      cleanupEmptyDir(userDir)
    }

    next(error)
  }
}

// Update usuario
export const updateUsuario = async (req, res, next) => {
  try {
    const { id } = req.params
    const { documento, nombre, direccion, correo, telefono, user_password, role } = req.body

    const usuario = await Usuario.findByPk(id)

    if (!usuario || usuario.is_delete) {
      // Clean up any uploaded files
      if (req.files) {
        if (req.files.documento_img && fs.existsSync(req.files.documento_img[0].path)) {
          fs.unlinkSync(req.files.documento_img[0].path)
        }
        if (req.files.registro_mercantil_img && fs.existsSync(req.files.registro_mercantil_img[0].path)) {
          fs.unlinkSync(req.files.registro_mercantil_img[0].path)
        }
      }

      // Clean up empty directory if it was created
      if (req.userUploadDir) {
        const userDir = path.join(__dirname, "..", "uploads", "user", req.userUploadDir)
        cleanupEmptyDir(userDir)
      }

      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    // Check if updating to an existing documento or correo
    if (documento || correo) {
      const existingUsuario = await Usuario.findOne({
        where: {
          id: { [Op.ne]: id },
          [Op.or]: [documento ? { documento } : null, correo ? { correo } : null].filter(Boolean),
          is_delete: false,
        },
      })

      if (existingUsuario) {
        // Clean up any uploaded files
        if (req.files) {
          if (req.files.documento_img && fs.existsSync(req.files.documento_img[0].path)) {
            fs.unlinkSync(req.files.documento_img[0].path)
          }
          if (req.files.registro_mercantil_img && fs.existsSync(req.files.registro_mercantil_img[0].path)) {
            fs.unlinkSync(req.files.registro_mercantil_img[0].path)
          }
        }

        // Clean up empty directory if it was created
        if (req.userUploadDir) {
          const userDir = path.join(__dirname, "..", "uploads", "user", req.userUploadDir)
          cleanupEmptyDir(userDir)
        }

        return res.status(400).json({
          success: false,
          message: "Another usuario with this documento or email already exists",
        })
      }
    }

    // Handle file updates if provided
    let documento_img_path = usuario.documento_img
    let registro_mercantil_img_path = usuario.registro_mercantil_img

    if (req.files) {
      // Update documento_img if provided
      if (req.files.documento_img) {
        // Delete old file if it exists
        const oldPath = path.join(__dirname, "..", usuario.documento_img)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
        documento_img_path = path.relative(path.join(__dirname, ".."), req.files.documento_img[0].path)
      }

      // Update registro_mercantil_img if provided
      if (req.files.registro_mercantil_img) {
        // Delete old file if it exists
        const oldPath = path.join(__dirname, "..", usuario.registro_mercantil_img)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
        registro_mercantil_img_path = path.relative(
          path.join(__dirname, ".."),
          req.files.registro_mercantil_img[0].path,
        )
      }
    }

    // Using ORM method for update
    await usuario.update({
      documento: documento || usuario.documento,
      nombre: nombre || usuario.nombre,
      direccion: direccion || usuario.direccion,
      documento_img: documento_img_path,
      registro_mercantil_img: registro_mercantil_img_path,
      correo: correo || usuario.correo,
      telefono: telefono || usuario.telefono,
      user_password: user_password || usuario.user_password,
      role: role || usuario.role,
    })

    return res.status(200).json({
      success: true,
      data: {
        id: usuario.id,
        documento: usuario.documento,
        nombre: usuario.nombre,
        correo: usuario.correo,
        role: usuario.role,
      },
    })
  } catch (error) {
    // Clean up any uploaded files on error
    if (req.files) {
      if (req.files.documento_img && fs.existsSync(req.files.documento_img[0].path)) {
        fs.unlinkSync(req.files.documento_img[0].path)
      }
      if (req.files.registro_mercantil_img && fs.existsSync(req.files.registro_mercantil_img[0].path)) {
        fs.unlinkSync(req.files.registro_mercantil_img[0].path)
      }
    }

    // Clean up empty directory if it was created
    if (req.userUploadDir) {
      const userDir = path.join(__dirname, "..", "uploads", "user", req.userUploadDir)
      cleanupEmptyDir(userDir)
    }

    next(error)
  }
}

// Soft delete usuario
export const deleteUsuario = async (req, res, next) => {
  try {
    const { id } = req.params

    const usuario = await Usuario.findByPk(id)

    if (!usuario || usuario.is_delete) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    // Soft delete by setting is_delete to true
    await usuario.update({ is_delete: true })

    return res.status(200).json({ success: true, message: "Usuario deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Hard delete usuario (for admin use only)
export const hardDeleteUsuario = async (req, res, next) => {
  try {
    const { id } = req.params

    const usuario = await Usuario.findByPk(id)

    if (!usuario) {
      return res.status(404).json({ success: false, message: "Usuario not found" })
    }

    // Delete associated files
    const documento_img_path = path.join(__dirname, "..", usuario.documento_img)
    const registro_mercantil_img_path = path.join(__dirname, "..", usuario.registro_mercantil_img)

    if (fs.existsSync(documento_img_path)) {
      fs.unlinkSync(documento_img_path)
    }

    if (fs.existsSync(registro_mercantil_img_path)) {
      fs.unlinkSync(registro_mercantil_img_path)
    }

    // Using raw SQL query with parameterized query to prevent SQL injection
    await sequelize.query("DELETE FROM usuarios WHERE id = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
    })

    // Clean up empty directory after deleting files
    const userDir = path.dirname(documento_img_path)
    cleanupEmptyDir(userDir)

    return res.status(200).json({ success: true, message: "Usuario permanently deleted" })
  } catch (error) {
    next(error)
  }
}

// Login usuario
export const loginUsuario = async (req, res, next) => {
  try {
    const { correo, password } = req.body

    // Find user by email
    const usuario = await Usuario.findOne({
      where: {
        correo,
        is_delete: false,
        is_active: true,
      },
    })

    if (!usuario) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    // Check if password matches
    const isMatch = await usuario.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    // Generate JWT token
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    })

    return res.status(200).json({
      success: true,
      data: {
        id: usuario.id,
        documento: usuario.documento,
        nombre: usuario.nombre,
        correo: usuario.correo,
        role: usuario.role,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}

