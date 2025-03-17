import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import dotenv from "dotenv"
import swaggerUi from "swagger-ui-express"
import { errorHandler } from "./middleware/errorHandler.js"
import routes from "./routes/index.js"
import { sequelize } from "./config/database.js"
import { swaggerSpec } from "./config/swagger.js"

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes
app.use("/api", routes)

// Error handling middleware
app.use(errorHandler)

// Start server
async function startServer() {
  try {
    // Sync database
    await sequelize.sync({ alter: true })
    console.log("Database connected successfully")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`)
    })
  } catch (error) {
    console.error("Unable to connect to the database:", error)
  }
}

startServer()

export default app

