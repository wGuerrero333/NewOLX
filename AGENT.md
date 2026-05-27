# AGENT.md - Guía para Agentes de Desarrollo

## Proyecto: NewOLX

Plataforma que emula OLX — venta de productos clasificados por categoría.

### Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML + CSS + JS (`public/`) |
| Backend | Express.js v5 |
| Base de datos | DynamoDB (AWS) |
| Infraestructura | Lambda + API Gateway + S3 + CloudFront |
| Imágenes | Presigned S3 URLs |
| Testing | Jest + Supertest |
| CI/CD | GitHub Actions |

### Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor con nodemon (desarrollo) |
| `npm start` | Iniciar servidor (producción) |
| `npm test` | Ejecutar tests con Jest (38 tests, 6 suites) |

### AWS

- **Cuenta**: `681432799230`
- **Región**: `us-east-2`
- **Usuario IAM**: `will333`
- **CloudFront**: `https://d3oxqm7f3a7rlu.cloudfront.net`
- **API Gateway**: `https://eqy6od44k3.execute-api.us-east-2.amazonaws.com`
- **Lambda**: `newolx-backend` (Node 22, handler `lambda.handler`, 256 MB, 30s)
- **S3 Frontend**: `newolx-frontend-681432799230`
- **S3 Uploads**: `newolx-uploads-681432799230` (público GET)
- **DynamoDB**: tablas `Ventas`, `Suscripciones`, `Correo` (PK `id:S`, PAY_PER_REQUEST)

### Workflows GitHub Actions

| Workflow | Trigger | Descripción |
|----------|---------|-------------|
| **CI** | `ci.yml` — push/PR a `main` | `npm test` |
| **Deploy** | `deploy.yml` — push a `main` | Empaqueta Lambda → `update-function-code`, `s3 sync public/`, invalida CloudFront |

### Testing

- `__testsBackend__/` — tests de backend (controladores + rutas)
- `__tests__/` — tests unitarios de frontend (helpers)
- Framework: Jest, HTTP: Supertest
- `app.js` exportado específicamente para testing

### Ramas

- `main` — producción (activa deploy automático)
- `CambiodinamoDB` — branch de trabajo anterior
- `todoOKAntesdeMergetoMain` — branch actual de trabajo

### Estructura del proyecto

```
NewOLX/
├── lambda.js              # Entry point serverless
├── server.js              # Entry point local
├── app.js                 # App exportable para testing
├── config.js              # Configuración
├── controllers/           # Lógica de negocio
├── routes/                # Definición de rutas API
├── db/                    # Conexión a DynamoDB (AWS SDK v3)
├── public/                # Archivos estáticos (HTML, CSS, JS)
├── __tests__/             # Tests frontend
├── __testsBackend__/      # Tests backend
└── .github/workflows/     # CI/CD pipelines
```
