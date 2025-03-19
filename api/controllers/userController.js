import { User } from "../models/index.js"
import { sequelize } from "../config/database.js"
import { generateToken } from "../utils/auth.js"

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    // Using raw SQL query with Sequelize
    const [users] = await sequelize.query("SELECT id, username, createdAt, updatedAt FROM users", {
      type: sequelize.QueryTypes.SELECT,
    })

    return res.status(200).json({ success: true, data: users })
  } catch (error) {
    next(error)
  }
}

// Get user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params

    // Using raw SQL query with parameterized query to prevent SQL injection
    const [user] = await sequelize.query("SELECT id, username, createdAt, updatedAt FROM users WHERE id = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    })

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    return res.status(200).json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}

// Create a new user
export const createUser = async (req, res, next) => {
  try {
    const { username, password } = req.body

    // Using ORM method for creation (which handles password hashing via hooks)
    const user = await User.create({ username, password })

    const token = generateToken(user.id)

    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        createdAt: user.createdAt,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}

// Update user
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const { username, password } = req.body

    const user = await User.findByPk(id)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    // Using ORM method for update (which handles password hashing via hooks)
    await user.update({
      username: username || user.username,
      password: password || user.password,
    })

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params

    // Using raw SQL query with parameterized query to prevent SQL injection
    const result = await sequelize.query("DELETE FROM users WHERE id = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
    })

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" })
    }

    return res.status(200).json({ success: true, message: "User deleted successfully" })
  } catch (error) {
    next(error)
  }
}

// Login user
export const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ where: { username } })

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const token = generateToken(user.id)

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}

