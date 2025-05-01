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

// Ensure payments directory exists
const paymentsDir = path.join(uploadsDir, "payments")
if (!fs.existsSync(paymentsDir)) {
  fs.mkdirSync(paymentsDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Si ya tenemos el directorio del usuario en la request, usamos ese
    if (req.userUploadDir) {
      cb(null, path.join(userBaseDir, req.userUploadDir));
      return;
    }

    // Si estamos procesando un pago (comprobante_img), usar un directorio específico para pagos
    if (file.fieldname === 'comprobante_img') {
      // Usar el ID de la orden si está disponible, o un timestamp si no
      const orderId = req.body.orden_id || Date.now().toString();
      const paymentDir = path.join(paymentsDir, orderId.toString());
      
      // Crear el directorio para este pago específico
      if (!fs.existsSync(paymentDir)) {
        fs.mkdirSync(paymentDir, { recursive: true });
      }
      
      cb(null, paymentDir);
      return;
    }

    // Obtener el nombre del usuario y el documento del cuerpo de la solicitud
    const userDocumento = req.body.documento;
    
    // Para otros tipos de archivos que requieren documento de usuario
    if (!userDocumento) {
      // Si no hay documento, usar un directorio temporal con timestamp
      const tempDir = path.join(uploadsDir, 'temp', Date.now().toString());
      
      // Asegurarnos de que el directorio existe
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      
      cb(null, tempDir);
      return;
    }

    // Crear el directorio con el formato deseado: nombre-documento
    const userDir = path.join(userBaseDir, userDocumento);
    
    // Asegurarnos de que el directorio existe
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // Almacenar el directorio en req para usarlo en archivos posteriores
    req.userUploadDir = userDocumento;
    cb(null, userDir);
  },
  filename: (req, file, cb) => {
    const fieldname = file.fieldname;
    const ext = path.extname(file.originalname);
    cb(null, `${fieldname}${ext}`);
  }
});

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