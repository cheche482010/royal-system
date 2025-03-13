# Proyecto: API + Frontend Web

Este proyecto es una aplicación web con un backend en Node.js utilizando Express y Sequelize, y un frontend en JavaScript con Webpack y SASS.

## **1. Estructura del Proyecto**

```
proyecto/
│── api/               # Backend (Node.js, Express, Sequelize)
│   ├── config/        # Configuración y conexión con la base de datos
│   │   ├── .env       # Variables de entorno
│   │   ├── db.js      # Configuración de Sequelize
│   ├── src/
│   │   ├── models/    # Modelos de la base de datos
│   │   ├── routes/    # Rutas de la API
│   │   ├── services/  # Lógica de negocio y autenticación
│   │   ├── utils/     # Utilidades y funciones auxiliares
│   ├── swagger.js     # Documentación con Swagger
│   ├── server.js      # Configuración y ejecución del servidor
│   ├── package.json   # Dependencias y scripts del backend
│── web/               # Frontend (JavaScript, Webpack, SASS)
│   ├── src/
│   │   ├── user/      # Módulo de usuario
│   │   ├── home/      
│   ├── index.js   # Archivo principal
│   ├── webpack.config.js  # Configuración de Webpack
│   ├── package.json   # Dependencias y scripts del frontend
│── README.md          # Documentación del proyecto
```

## **2. Configuración del Backend**

### **Instalación**
```sh
cd api
npm install
```

### **Variables de Entorno**
El archivo `.env` en `api/config/` debe contener:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=proyecto
JWT_SECRET=tu_secreto_seguro
```

### **Ejecutar el Servidor**
```sh
npm run dev
```

La API estará disponible en: `http://localhost:5000`

### **Rutas del Backend**
| Método  | Ruta             | Descripción |
|---------|-----------------|-------------|
| POST    | /api/user/register  | Registrar usuario |
| POST    | /api/user/login     | Iniciar sesión |
| GET     | /api-docs         | Documentación Swagger |

## **3. Configuración del Frontend**

### **Instalación**
```sh
cd web
npm install
```

### **Compilar el Frontend**
```sh
npm run build
```

### **Ejecutar el Frontend**
```sh
npm start
```
El frontend estará disponible en: `http://localhost:3000`

## **4. Swagger - Documentación de la API**

La documentación de la API está disponible en:
```
http://localhost:5000/api-docs
```

## **5. Tecnologías Utilizadas**

### **Backend:**
- Node.js
- Express
- Sequelize (ORM para MySQL)
- bcryptjs (Hash de contraseñas)
- jsonwebtoken (Autenticación con JWT)
- dotenv (Manejo de variables de entorno)
- Swagger (Documentación de API)

### **Frontend:**
- JavaScript puro
- Webpack
- SASS
- Fetch API para consumo de la API

## **6. Contacto y Contribución**
Si deseas contribuir, puedes hacer un fork del repositorio, crear una nueva rama y enviar un Pull Request.

