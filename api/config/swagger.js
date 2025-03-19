import swaggerJsDoc from "swagger-jsdoc"

// Swagger configuration options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Node MySQL API",
      version: "1.0.0",
      description: "A simple CRUD API with Node.js and MySQL",
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

