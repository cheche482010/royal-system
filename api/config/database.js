import { Sequelize } from "sequelize"
import dotenv from "dotenv"

dotenv.config()

// Create Sequelize instance
export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  port: process.env.DB_PORT || 3306,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

// Test database connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate()
    console.log("Connection has been established successfully.")
    return true
  } catch (error) {
    console.error("Unable to connect to the database:", error)
    return false
  }
}

