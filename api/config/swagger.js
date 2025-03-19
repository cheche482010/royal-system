import swaggerJsDoc from "swagger-jsdoc"

// Swagger configuration options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Royal System API",
      version: "1.0.0",
      description: "API documentation for Royal System",
      termsOfService: "https://example.com/terms/",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://your-production-url.com/api"
            : `http://localhost:${process.env.PORT || 3000}/api`,
        description: process.env.NODE_ENV === "production" ? "Production server" : "Development server",
      },
    ],
    tags: [
      {
        name: "Usuarios",
        description: "Modulo Usuarios"
      },
      {
        name: "Productos",
        description: "Modulo Productos"
      },
      {
        name: "Precios",
        description: "Modulo Precios"
      },
      {
        name: "Pagos",
        description: "Modulo Pagos"
      },
      {
        name: "Precio Usuarios"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Example: {
          type: "object",
          required: ["name"],
          properties: {
            id: {
              type: "integer",
              description: "Example ID",
            },
            name: {
              type: "string",
              description: "Example name",
            },
            description: {
              type: "string",
              description: "Example description",
            },
            isActive: {
              type: "boolean",
              description: "Active status",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
          },
        },
        Usuario: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Usuario ID",
            },
            rif_cedula: {
              type: "string",
              description: "RIF o Cédula del usuario",
            },
            nombre: {
              type: "string",
              description: "Nombre del usuario",
            },
            direccion: {
              type: "string",
              description: "Dirección del usuario",
            },
            registro_mercantil: {
              type: "string",
              description: "Registro mercantil del usuario",
            },
            volumen_compra: {
              type: "integer",
              description: "Volumen de compra del usuario",
            },
            correo: {
              type: "string",
              description: "Correo del usuario",
            },
            telefono: {
              type: "string",
              description: "Teléfono del usuario",
            },
            is_active: {
              type: "boolean",
              description: "Estado activo",
            },
            is_delete: {
              type: "boolean",
              description: "Estado de eliminación",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Fecha de última actualización",
            },
          },
        },
        Producto: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Producto ID",
            },
            codigo: {
              type: "string",
              description: "Código del producto",
            },
            nombre: {
              type: "string",
              description: "Nombre del producto",
            },
            descripcion: {
              type: "string",
              description: "Descripción del producto",
            },
            presentacion: {
              type: "string",
              description: "Presentación del producto",
            },
            cantidad: {
              type: "integer",
              description: "Cantidad del producto",
            },
            is_active: {
              type: "boolean",
              description: "Estado activo",
            },
            is_delete: {
              type: "boolean",
              description: "Estado de eliminación",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Fecha de última actualización",
            },
          },
        },
        Pago: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Pago ID",
            },
            precio_usuario_id: {
              type: "integer",
              description: "ID del precio usuario",
            },
            producto_id: {
              type: "integer",
              description: "ID del producto",
            },
            fecha: {
              type: "string",
              format: "date-time",
              description: "Fecha del pago",
            },
            referencia: {
              type: "string",
              description: "Referencia del pago",
            },
            numero_referencia: {
              type: "string",
              description: "Número de referencia del pago",
            },
            monto: {
              type: "number",
              format: "float",
              description: "Monto del pago",
            },
            is_active: {
              type: "boolean",
              description: "Estado activo",
            },
            is_delete: {
              type: "boolean",
              description: "Estado de eliminación",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Fecha de última actualización",
            },
          },
        },
        Precio: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Precio ID",
            },
            codigo_precio: {
              type: "integer",
              description: "Código del precio",
            },
            nombre_precio: {
              type: "string",
              description: "Nombre del precio",
            },
            precio_unidad: {
              type: "number",
              format: "float",
              description: "Precio por unidad",
            },
            is_active: {
              type: "boolean",
              description: "Estado activo",
            },
            is_delete: {
              type: "boolean",
              description: "Estado de eliminación",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Fecha de última actualización",
            },
          },
        },
        PrecioUsuario: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Precio Usuario ID",
            },
            usuario_id: {
              type: "integer",
              description: "ID del usuario",
            },
            precio_id: {
              type: "integer",
              description: "ID del precio",
            },
            is_active: {
              type: "boolean",
              description: "Estado activo",
            },
            is_delete: {
              type: "boolean",
              description: "Estado de eliminación",
            },
            created_at: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación",
            },
            updated_at: {
              type: "string",
              format: "date-time",
              description: "Fecha de última actualización",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Path to the API routes files
}

// Initialize swagger-jsdoc
export const swaggerSpec = swaggerJsDoc(swaggerOptions)

