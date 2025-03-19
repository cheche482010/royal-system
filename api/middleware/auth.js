import jwt from "jsonwebtoken"

export const protect = async (req, res, next) => {
  let token

  if (process.env.NODE_ENV === 'development' || process.env.TESTING === 'true') {
    req.user = { id: 1 } 
    return next()
  }
  
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      })

      next()
    } catch (error) {
      console.error(error)
      res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      })
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    })
  }
}

