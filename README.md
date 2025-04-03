### RoyalShop - Tienda Online

Este proyecto es una aplicación de tienda online completa con un backend en Node.js utilizando Express y MySQL (Sequelize), y un frontend en Vue.js.

## **1. Estructura del Proyecto**

```
royal-system/
│
├── api/                      # Backend (Node.js, Express, Sequelize)
│   ├── config/               # Archivos de configuración
│   │   ├── database.js       # Configuración de conexión a la base de datos
│   │   ├── swagger.js        # Configuración de Swagger
│   │   └── db/               # Scripts SQL
│   │       ├── data.sql      # Datos iniciales
│   │       └── db.sql        # Estructura de la base de datos
│   │
│   ├── controllers/          # Controladores de la API
│   │   └── UsuarioController.js
│   ├── middleware/           # Middleware personalizado
│   │   ├── auth.js           # Middleware de autenticación
│   │   └── errorHandler.js   # Manejador global de errores
│   │
│   ├── models/               # Modelos de la base de datos
│   │   ├── Usuario.js
│   │   └── index.js          # Exportación de modelos
│   │
│   ├── routes/               # Rutas de la API
│   │   ├── index.js          # Cargador de rutas
│   │   └── UsuarioRoutes.js
│   │
│   ├── utils/                # Funciones de utilidad
│   │   ├── auth.js           # Utilidades de autenticación
│   │   └── validators.js     # Validación de entrada
│   │
│   ├── .env                  # Variables de entorno (no incluido en el repositorio)
│   ├── .env.example          # Ejemplo de archivo de variables de entorno
│   ├── .htaccess             # Configuración de Apache
│   ├── app.js                # Punto de entrada de la aplicación
│   └── package.json          # Dependencias del proyecto
│
├── web/                      # Frontend (Vue.js)
│   ├── src/
│   │   ├── App.vue           # Componente principal
│   │   ├── main.js           # Punto de entrada
│   │   │
│   │   ├── assets/           # Recursos estáticos
│   │   │   ├── img/          # Imágenes
│   │   │   └── styles/       # Estilos SCSS
│   │   │
│   │   ├── components/       # Componentes reutilizables
│   │   │   └── Header/       # Componente de cabecera
│   │   │
│   │   ├── router/           # Configuración de rutas
│   │   │   └── index.js      # Definición de rutas
│   │   │
│   │   └── views/            # Vistas/Páginas
│   │       ├── Cart/         # Vista de carrito
│   │       ├── Error/404/    # Página de error 404
│   │       ├── Home/         # Página principal
│   │       ├── Login/        # Página de inicio de sesión
│   │       ├── Payment/      # Página de pago
│   │       ├── Product/      # Página de producto
│   │       ├── Register/     # Página de registro
│   │       └── User/         # Página de perfil de usuario
│   │
│   ├── index.html            # Archivo HTML principal
│   ├── package.json          # Dependencias del frontend
│   └── vite.config.js        # Configuración de Vite
│
├── .gitignore                # Archivos ignorados por Git
└── README.md                 # Documentación del proyecto
```

## **2. Cómo clonar el repositorio**

```sh
git clone https://github.com/cheche482010/royal-system
cd royalshop
```

## **3. Configuración del Backend**

### **Instalación de dependencias**

```sh
cd api
npm install
```

### **Configuración de variables de entorno**

Crea un archivo `.env` en la carpeta `api/` basado en el archivo `.env.example`:

```sh
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:

```env
# Server configuration
PORT=3000
NODE_ENV=development
TESTING=true

# Database configuration
DB_SERVER=mysql
DB_HOST=localhost
DB_PORT=3306
DB_NAME=royal-system
DB_USER=root
DB_PASSWORD=root

# JWT Secret for Auth
JWT_SECRET=token

# MySQL Database URL for migrations
DATABASE_URL=mysql://root:password@localhost:3306/royal-system
```

### **Configuración de la base de datos**

1. Crea una base de datos MySQL llamada `royal-system`
2. Ejecuta los scripts SQL ubicados en `api/config/db/`


### **Ejecutar el servidor backend**

```sh
npm run dev
```

El backend estará disponible en: `http://localhost:3000`

## **4. Configuración del Frontend**

### **Instalación de dependencias**

```sh
cd web
npm install
```

### **Ejecutar el servidor de desarrollo**

```sh
npm run dev
```

El frontend estará disponible en: `http://localhost:5173`

## **5. Documentación de la API**

La documentación de la API (Swagger) está disponible en:

```
http://localhost:3000/api-docs
```

## **6. Principales endpoints de la API**

| Método | Ruta | Descripción
|--------|------|-----
| POST   | /api/usuarios/create | Registrar usuario
| POST   | /api/usuarios/login  | Iniciar sesión
| GET    | /api/productos       | Obtener todos los productos
| GET    | /api/productos/:id   | Obtener un producto por ID
| POST   | /api/pagos           | Crear un nuevo pago
| GET    | /api/precios         | Obtener todos los precios


## **7. Tecnologías Utilizadas**

### **Backend:**

- Node.js
- Express
- MySQL
- Sequelize (ORM)
- JWT (JSON Web Tokens)
- Swagger (Documentación de API)
- Multer (Manejo de archivos)


### **Frontend:**

- Vue.js
- Vue Router
- SCSS
- Vite (Herramienta de construcción)
- Fetch API para consumo de la API


## **8. Contacto y Contribución**

Si deseas contribuir, puedes hacer un fork del repositorio, crear una nueva rama y enviar un Pull Request.

## **9. Licencia**

Este proyecto está bajo la Licencia MIT.