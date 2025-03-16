export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode
    let message = err.message
  
    // Sequelize validation errors
    if (err.name === "SequelizeValidationError") {
      statusCode = 400
      message = err.errors.map((e) => e.message).join(", ")
    }
  
    // Sequelize unique constraint error
    if (err.name === "SequelizeUniqueConstraintError") {
      statusCode = 400
      message = "This value already exists"
    }
  
    // Sequelize database error
    if (err.name === "SequelizeDatabaseError") {
      statusCode = 500
      message = "A database error occurred"
    }
  
    // Send error response
    res.status(statusCode).json({
      success: false,
      message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })
  }
  
  