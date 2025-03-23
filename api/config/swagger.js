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
        Usuario: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            nombre: {
              type: "string",
              example: "John"
            },
            apellido: {
              type: "string",
              example: "Doe"
            },
            email: {
              type: "string",
              example: "john.doe@example.com"
            },
            password: {
              type: "string",
              example: "hashedpassword"
            },
            telefono: {
              type: "string",
              example: "+584141234567"
            },
            direccion: {
              type: "string",
              example: "123 Main St, City"
            },
            documento_tipo: {
              type: "string",
              example: "V"
            },
            documento_numero: {
              type: "string",
              example: "12345678"
            },
            documento_img: {
              type: "string",
              example: "/uploads/user/12345/documento-12345.jpg"
            },
            registro_mercantil_img: {
              type: "string",
              example: "/uploads/user/12345/registro-12345.jpg"
            },
            role: {
              type: "string",
              enum: ["admin", "cliente", "vendedor"],
              example: "cliente"
            },
            is_active: {
              type: "boolean",
              example: true
            },
            is_delete: {
              type: "boolean",
              example: false
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        },
        Bitacora: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            usuario_id: {
              type: "integer",
              example: 1
            },
            accion: {
              type: "string",
              example: "Inicio de sesión"
            },
            tabla: {
              type: "string",
              example: "usuarios"
            },
            descripcion: {
              type: "string",
              example: "El usuario inició sesión en el sistema"
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        },
        Carrito: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            usuario_id: {
              type: "integer",
              example: 1
            },
            producto_id: {
              type: "integer",
              example: 1
            },
            cantidad: {
              type: "integer",
              example: 2
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        },
        Categoria: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            nombre: {
              type: "string",
              example: "Electrónicos"
            },
            descripcion: {
              type: "string",
              example: "Productos electrónicos y gadgets"
            },
            is_active: {
              type: "boolean",
              example: true
            },
            is_delete: {
              type: "boolean",
              example: false
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        },
        DetalleOrden: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            orden_id: {
              type: "integer",
              example: 1
            },
            producto_id: {
              type: "integer",
              example: 1
            },
            cantidad: {
              type: "integer",
              example: 2
            },
            precio: {
              type: "number",
              format: "float",
              example: 99.99
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        },
        DolarBCV: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            tasa: {
              type: "number",
              format: "float",
              example: 35.50
            },
            fecha: {
              type: "string",
              format: "date",
              example: "2023-01-01"
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        },
        Factura: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            orden_id: {
              type: "integer",
              example: 1
            },
            numero: {
              type: "string",
              example: "F-2023-001"
            },
            fecha: {
              type: "string",
              format: "date",
              example: "2023-01-01"
            },
            monto_total: {
              type: "number",
              format: "float",
              example: 199.99
            },
            impuesto: {
              type: "number",
              format: "float",
              example: 16.0
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        },
        HistorialPrecio: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            producto_id: {
              type: "integer",
              example: 1
            },
            precio_anterior: {
              type: "number",
              format: "float",
              example: 89.99
            },
            precio_nuevo: {
              type: "number",
              format: "float",
              example: 99.99
            },
            fecha_cambio: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            },
            usuario_id: {
              type: "integer",
              example: 1
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        },
        Inventario: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            producto_id: {
              type: "integer",
              example: 1
            },
            cantidad: {
              type: "integer",
              example: 100
            },
            ubicacion: {
              type: "string",
              example: "Almacén A, Estante 3"
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        },
        Marca: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            nombre: {
              type: "string",
              example: "Samsung"
            },
            descripcion: {
              type: "string",
              example: "Marca de electrónicos y electrodomésticos"
            },
            logo_img: {
              type: "string",
              example: "/uploads/marca/12345/logo-12345.jpg"
            },
            is_active: {
              type: "boolean",
              example: true
            },
            is_delete: {
              type: "boolean",
              example: false
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        },
        MetodoPago: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            nombre: {
              type: "string",
              example: "Transferencia Bancaria"
            },
            descripcion: {
              type: "string",
              example: "Pago mediante transferencia bancaria"
            },
            instrucciones: {
              type: "string",
              example: "Transferir el monto a la cuenta 0000-0000-0000-0000"
            },
            is_active: {
              type: "boolean",
              example: true
            },
            is_delete: {
              type: "boolean",
              example: false
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        },
        Orden: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            usuario_id: {
              type: "integer",
              example: 1
            },
            fecha: {
              type: "string",
              format: "date",
              example: "2023-01-01"
            },
            monto_total: {
              type: "number",
              format: "float",
              example: 199.99
            },
            status: {
              type: "string",
              enum: ["Pendiente", "Completa", "Cancelada"],
              example: "Pendiente"
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        },
        Pago: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            orden_id: {
              type: "integer",
              example: 1
            },
            metodo_pago_id: {
              type: "integer",
              example: 1
            },
            monto: {
              type: "number",
              format: "float",
              example: 199.99
            },
            referencia: {
              type: "string",
              example: "REF123456789"
            },
            comprobante_img: {
              type: "string",
              example: "/uploads/pago/12345/comprobante-12345.jpg"
            },
            status: {
              type: "string",
              enum: ["Pendiente", "Aprobado", "Rechazado"],
              example: "Pendiente"
            },
            fecha_pago: {
              type: "string",
              format: "date",
              example: "2023-01-01"
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        },
        Producto: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            codigo: {
              type: "string",
              example: "PROD-001"
            },
            nombre: {
              type: "string",
              example: "Smartphone Galaxy S21"
            },
            descripcion: {
              type: "string",
              example: "Smartphone de última generación con 128GB de almacenamiento"
            },
            precio_unidad: {
              type: "number",
              format: "float",
              example: 699.99
            },
            categoria_id: {
              type: "integer",
              example: 1
            },
            marca_id: {
              type: "integer",
              example: 1
            },
            producto_img: {
              type: "string",
              example: "/uploads/producto/12345/producto-12345.jpg"
            },
            is_active: {
              type: "boolean",
              example: true
            },
            is_delete: {
              type: "boolean",
              example: false
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        },
        Sesion: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            usuario_id: {
              type: "integer",
              example: 1
            },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            },
            ip: {
              type: "string",
              example: "192.168.1.1"
            },
            dispositivo: {
              type: "string",
              example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            },
            fecha_expiracion: {
              type: "string",
              format: "date-time",
              example: "2023-02-01T00:00:00Z"
            },
            is_active: {
              type: "boolean",
              example: true
            },
            created_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            },
            updated_at: {
              type: "string",
              format: "date-time",
              example: "2023-01-01T00:00:00Z"
            }
          }
        }
      },
    },
  },
  apis: ["./routes/*.js"], // Path to the API routes files
}

// Initialize swagger-jsdoc
export const swaggerSpec = swaggerJsDoc(swaggerOptions)

