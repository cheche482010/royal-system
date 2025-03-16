import { Example } from "../models/index.js"
import { sequelize } from "../config/database.js"

// Get all examples
export const getAllExamples = async (req, res, next) => {
  try {
    // Using raw SQL query
    const [examples] = await sequelize.query("SELECT * FROM Examples", { type: sequelize.QueryTypes.SELECT })

    return res.status(200).json({ success: true, data: examples })
  } catch (error) {
    next(error)
  }
}

// Get example by ID
export const getExampleById = async (req, res, next) => {
  try {
    const { id } = req.params

    // Using raw SQL query with parameterized query
    const [example] = await sequelize.query("SELECT * FROM Examples WHERE id = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.SELECT,
    })

    if (!example) {
      return res.status(404).json({ success: false, message: "Example not found" })
    }

    return res.status(200).json({ success: true, data: example })
  } catch (error) {
    next(error)
  }
}

// Create a new example
export const createExample = async (req, res, next) => {
  try {
    const { name, description, isActive } = req.body

    // Using ORM method for creation
    const example = await Example.create({
      name,
      description,
      isActive: isActive !== undefined ? isActive : true,
    })

    return res.status(201).json({
      success: true,
      data: example,
    })
  } catch (error) {
    next(error)
  }
}

// Update example
export const updateExample = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, description, isActive } = req.body

    const example = await Example.findByPk(id)

    if (!example) {
      return res.status(404).json({ success: false, message: "Example not found" })
    }

    // Update with raw SQL for demonstration
    await sequelize.query("UPDATE Examples SET name = ?, description = ?, isActive = ? WHERE id = ?", {
      replacements: [
        name || example.name,
        description || example.description,
        isActive !== undefined ? isActive : example.isActive,
        id,
      ],
      type: sequelize.QueryTypes.UPDATE,
    })

    const updatedExample = await Example.findByPk(id)

    return res.status(200).json({
      success: true,
      data: updatedExample,
    })
  } catch (error) {
    next(error)
  }
}

// Delete example
export const deleteExample = async (req, res, next) => {
  try {
    const { id } = req.params

    // Using raw SQL query
    const result = await sequelize.query("DELETE FROM Examples WHERE id = ?", {
      replacements: [id],
      type: sequelize.QueryTypes.DELETE,
    })

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Example not found" })
    }

    return res.status(200).json({ success: true, message: "Example deleted successfully" })
  } catch (error) {
    next(error)
  }
}

