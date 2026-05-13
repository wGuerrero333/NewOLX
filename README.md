# NewOLX

Plataforma que emula **OLX** — venta de productos clasificados por categoría.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | React + HTML estático (`public/`) |
| Backend | Express.js v5 |
| Base de datos | MySQL (mysql2) |
| Testing | Jest + Supertest |

## Estructura

```
NewOLX/
├── server.js              # Entry point
├── app.js                 # App exportable para testing
├── config.js              # Configuración del proyecto
├── fileToMCP.js           # Script de automatización GitHub (MCP)
├── controllers/           # Lógica de negocio
├── routes/                # Definición de rutas API
├── middleware/            # Middleware (multer, etc.)
├── db/                    # Conexión a MySQL
├── public/                # Archivos estáticos (HTML, CSS, JS)
├── uploads/               # Imágenes subidas
├── __test__/              # Tests de frontend
└── __testBackend__/       # Tests de backend
```

## Requisitos

- Node.js >= 18
- MySQL
- npm

## Instalación

```bash
npm install
```

Configurar variables de entorno (`.env`):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=newolx
```

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor con nodemon (desarrollo) |
| `npm start` | Iniciar servidor (producción) |
| `npm test` | Ejecutar tests con Jest |

## API

| Endpoint | Descripción |
|----------|-------------|
| `GET /` | Página principal (home.html) |
| `GET /form.html` | Formulario de publicación |
| `GET /detail` | Detalle de producto |
| `/api/ventas` | CRUD de productos/ventas |
| `/api/suscripciones` | Gestión de suscripciones |
| `/api/correo` | Funcionalidades de correo |

## MCP GitHub Automation

`fileToMCP.js` automatiza la creación de Issues y Pull Requests vía la API de GitHub.

### Uso

```bash
node fileToMCP.js issues                    # Listar issues abiertos
node fileToMCP.js issue <título> [cuerpo]   # Crear un issue
node fileToMCP.js prs                       # Listar PRs abiertos
node fileToMCP.js pr <título> <base> <head> # Crear un PR
node fileToMCP.js --repo <owner/repo>       # Apuntar a otro repo
```

### Ejemplos

```bash
node fileToMCP.js issues
node fileToMCP.js issue "Agregar autenticación" "Implementar login con JWT"
node fileToMCP.js pr "Fix login" main fix-login
node fileToMCP.js issue "Bug" --repo wGuerrero333/expressServerNode
```

### Configuración

El script lee automáticamente el token desde `~/.opencode/mcp.json` (configuración de opencode). Requiere un token de GitHub con scope `public_repo` o `repo`.

## Testing

```bash
npm test
```

- Framework: **Jest**
- HTTP testing: **Supertest**
- `app.js` exportado específicamente para testing
- Tests de frontend en `__test__/`
- Tests de backend en `__testBackend__/`

## Notas

- Servidor corre en puerto **3000**
- Archivos estáticos servidos desde `public/`
- Imágenes subidas almacenadas en `uploads/`
- Variables de entorno manejadas con dotenv
