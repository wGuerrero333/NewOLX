# AGENT.md - Guía para Agentes de Desarrollo

## Descripción del Proyecto

Proyecto que emula **OLX** - plataforma de venta de productos por categoría.

- **Frontend:** React + HTML estático (`public/`)
- **Backend:** Express.js v5
- **Base de datos:** MySQL (mysql2)
- **Testing:** Jest + Supertest

## Estructura del Proyecto

```
NewOLX/
├── server.js              # Entry point, configuración Express y rutas
├── app.js                 # App exportable para testing
├── config.js              # Configuración del proyecto
├── controllers/           # Lógica de negocio
│   ├── ventas.controller.js
│   ├── suscripciones.controller.js
│   └── correo.controller.js
├── routes/                # Definición de rutas API
│   ├── ventas.routes.js
│   ├── suscripciones.routes.js
│   └── correo.routes.js
├── middleware/
│   └── multer.js          # Configuración de subida de archivos
├── db/
│   └── db.js              # Conexión a MySQL
├── public/                # Archivos estáticos (HTML, CSS, JS frontend)
├── uploads/               # Imágenes subidas por usuarios
├── __test__/              # Tests de frontend y validaciones
└── __testBackend__/       # Tests de backend
```

## Comandos Principales

| Comando          | Descripción                          |
|------------------|--------------------------------------|
| `npm run dev`    | Iniciar servidor con nodemon (dev)   |
| `npm start`      | Iniciar servidor (producción)        |
| `npm test`       | Ejecutar tests con Jest              |

## APIs Disponibles

| Endpoint              | Descripción                    |
|-----------------------|--------------------------------|
| `GET /`               | Página principal (home.html)   |
| `GET /form.html`      | Formulario de publicación      |
| `GET /detail`         | Página de detalle de producto  |
| `/api/ventas`         | CRUD de productos/ventas       |
| `/api/suscripciones`  | Gestión de suscripciones       |
| `/api/correo`         | Funcionalidades de correo      |

## Convenciones de Código

### Nombrado de Archivos
- Controllers: `<entidad>.controller.js`
- Routes: `<entidad>.routes.js`
- Kebab-case para rutas y endpoints

### Estructura de Controllers
- Cada controller maneja una entidad de negocio
- Usar async/await para operaciones con DB
- Retornar respuestas JSON consistentes

### Estructura de Routes
- Router de Express separado por entidad
- Vinculado a su controller correspondiente

### Base de Datos
- Conexión centralizada en `db/db.js`
- Usar prepared statements para prevenir SQL injection
- mysql2 como driver

## Testing

- Framework: **Jest**
- HTTP testing: **Supertest**
- `app.js` exportado específicamente para testing
- Tests de frontend en `__test__/`
- Tests de backend en `__testBackend__/`

## Dependencias Clave

| Paquete         | Uso                              |
|-----------------|----------------------------------|
| express         | Framework web                    |
| mysql2          | Driver MySQL                     |
| multer          | Subida de archivos               |
| body-parser     | Parsing de request body          |
| cors            | Middleware CORS                  |
| morgan          | Logging de requests              |
| dotenv          | Variables de entorno             |
| nodemon         | Hot reload en desarrollo         |
| jest            | Testing framework                |
| supertest       | Testing de APIs HTTP             |

## Notas Importantes

- Servidor corre en puerto **3000**
- Archivos estáticos servidos desde `public/`
- Imágenes subidas almacenadas en `uploads/`
- Registro de usuarios y productos funcional
- Variables de entorno manejadas con dotenv
