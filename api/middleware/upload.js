import multer from "multer"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

// Get current directory name (for ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Base uploads directory
const uploadsDir = path.join(__dirname, "..", "uploads")

// Ensure base uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Ensure user directory exists
const userBaseDir = path.join(uploadsDir, "user")
if (!fs.existsSync(userBaseDir)) {
  fs.mkdirSync(userBaseDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get the user's name or use a timestamp if not available
    // Normalize the name to avoid spaces and special characters
    const userName = req.body.nombre ? req.body.nombre.replace(/\s+/g, "_").toLowerCase() : Date.now().toString()

    // Store the userName in the request object to ensure both files use the same directory
    req.userUploadDir = req.userUploadDir || userName

    // Create user directory
    const userDir = path.join(userBaseDir, req.userUploadDir)

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true })
    }

    cb(null, userDir)
  },
  filename: (req, file, cb) => {
    // Use fieldname to determine file type
    const fieldname = file.fieldname === "documento_img" ? "documento_img" : "registro_mercantil_img"

    // Create unique filename with original extension
    const ext = path.extname(file.originalname)
    cb(null, `${fieldname}${ext}`)
  },
})

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "application/pdf"]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Invalid file type. Only JPEG, JPG, PNG, GIF and PDF files are allowed."), false)
  }
}

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
})

// Helper function to clean up empty directories
const cleanupEmptyDir = (dirPath) => {
  try {
    // Check if directory exists
    if (fs.existsSync(dirPath)) {
      // Read directory contents
      const files = fs.readdirSync(dirPath)

      // If directory is empty, remove it
      if (files.length === 0) {
        fs.rmdirSync(dirPath)
        console.log(`Removed empty directory: ${dirPath}`)
      }
    }
  } catch (error) {
    console.error(`Error cleaning up directory: ${error.message}`)
  }
}

export { upload, cleanupEmptyDir }
export default upload

