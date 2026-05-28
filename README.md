# NewOLX

![CI](https://github.com/wGuerrero333/NewOLX/actions/workflows/ci.yml/badge.svg)
![Deploy](https://github.com/wGuerrero333/NewOLX/actions/workflows/deploy.yml/badge.svg)
![Security](https://github.com/wGuerrero333/NewOLX/actions/workflows/security.yml/badge.svg)

Plataforma que emula **OLX** — venta de productos clasificados por categoría.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML + CSS + JS (`public/`) |
| Backend | Express.js v5 |
| Base de datos | DynamoDB (AWS) |
| Infraestructura | Lambda + API Gateway + S3 + CloudFront |
| Imágenes | Presigned S3 URLs |
| Testing | Jest + Supertest |
| CI/CD | GitHub Actions |

## Estructura

```
NewOLX/
├── lambda.js              # Entry point (serverless)
├── server.js              # Entry point (local)
├── app.js                 # App exportable para testing
├── config.js              # Configuración
├── fileToMCP.js           # Script MCP (GitHub Automation)
├── controllers/           # Lógica de negocio
├── routes/                # Definición de rutas API
├── db/                    # DynamoDB (AWS SDK v3)
├── public/                # Frontend estático (HTML, CSS, JS)
├── __tests__/             # Tests frontend
├── __testsBackend__/      # Tests backend
└── .github/workflows/     # CI/CD pipelines
```

## Requisitos

- Node.js >= 18
- npm
- Cuenta AWS (DynamoDB, S3, Lambda, API Gateway, CloudFront)

## Instalación

```bash
npm install
```

Configurar credenciales AWS vía `~/.aws/credentials` o variables de entorno:

```
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-2
```

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor local con nodemon |
| `npm start` | Servidor local (producción) |
| `npm test` | Tests con Jest (38 tests, 6 suites) |

## API

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `GET /` | HTML | Página principal (home.html) |
| `GET /form.html` | HTML | Formulario de publicación |
| `GET /detail` | HTML | Detalle de producto |
| `/api/ventas` | GET/POST/PUT/DELETE | CRUD de productos |
| `/api/suscripciones` | GET/POST/PUT/DELETE | CRUD de suscripciones |
| `/api/correo` | GET/POST | Gestión de correo |
| `/api/uploads/presigned` | GET | Obtener presigned URL para subir imagen a S3 |

## Workflows (GitHub Actions)

| Workflow | Trigger | Descripción |
|----------|---------|-------------|
| **CI** | Push/PR a `main` | `npm test` |
| **Deploy** | Push a `main` | Lambda → S3 → invalida CloudFront |
| **Security** | Push/PR a `main` | `npm audit` + CodeQL + Gitleaks |

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
- Tests de frontend en `__tests__/`
- Tests de backend en `__testsBackend__/`

## Notas

- Local: puerto **3000**; Producción: Lambda + API Gateway
- Frontend servido desde S3 vía CloudFront
- Imágenes subidas a S3 mediante presigned URLs
- URL pública: `https://d3oxqm7f3a7rlu.cloudfront.net`
