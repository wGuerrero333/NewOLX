# Despliegue NewOLX en AWS

## Arquitectura

```
Usuario → CloudFront (d3oxqm7f3a7rlu.cloudfront.net)
           ├── /*              → S3 (frontend estático HTML+CSS+JS)
           ├── /api/*          → API Gateway → Lambda (Express)
           └── /uploads/*      → S3 (imágenes, presigned URLs)
```

## Recursos Creados

| Recurso | Nombre | Propósito |
|---|---|---|
| **S3** | `newolx-frontend-681432799230` | Archivos estáticos (HTML, CSS, JS) |
| **S3** | `newolx-uploads-681432799230` | Imágenes subidas por usuarios (CORS configurado) |
| **DynamoDB** | `Ventas`, `Suscripciones`, `Correo` | Base de datos (PAY_PER_REQUEST, clave `id:S`) |
| **Lambda** | `newolx-backend` | Express.js envuelto con `@codegenie/serverless-express` |
| **API Gateway** | `eqy6od44k3` (HTTP API) | Ruta `ANY /api/{proxy+}` → Lambda |
| **CloudFront** | `d3oxqm7f3a7rlu.cloudfront.net` | CDN unificando frontend + API |
| **IAM Role** | `newolx-backend-role-aqbc8q3s` | Rol de ejecución Lambda |

## Pasos Realizados

### 1. Base de Datos (DynamoDB)
- Reemplazo de MySQL por DynamoDB
- Tres tablas separadas con `id:S` como PK y `PAY_PER_REQUEST`
- IDs generados con `crypto.randomUUID()` en Node.js
- Driver: `@aws-sdk/client-dynamodb` + `@aws-sdk/lib-dynamodb`

### 2. Backend (Express → Lambda)
- Wrapper `lambda.js` con `@codegenie/serverless-express`
- Subida de imágenes: multer → presigned URLs de S3
- Endpoint `GET /api/uploads/presigned?extension=.jpg` genera URL firmada
- Configuración Lambda: Node.js 22.x, handler `lambda.handler`, 256 MB, 30s timeout

### 3. Frontend (S3 + CloudFront)
- Bucket S3 con Static Website Hosting (`home.html` como índice)
- CloudFront con dos orígenes: S3 (frontend) y API Gateway (backend)
- CloudFront Function `rewrite-detail` para servir `/detail` → `/detail.html`

### 4. API Gateway
- HTTP API con ruta `ANY /api/{proxy+}` integrada con Lambda
- CloudFront redirige `/api/*` al API Gateway

## Costos (Free Tier)

| Servicio | Costo mensual |
|---|---|
| S3 | ~$0 |
| CloudFront | ~$0 (1TB gratis) |
| API Gateway | ~$0 (1M reqs gratis) |
| Lambda | ~$0 (1M reqs gratis) |
| DynamoDB | ~$0 (25GB gratis) |
| **Total** | **~$0/mes** |

## URLs Finales

| Componente | URL |
|---|---|
| Frontend + API | `https://d3oxqm7f3a7rlu.cloudfront.net` |
| API Gateway directa | `https://eqy6od44k3.execute-api.us-east-2.amazonaws.com` |

## Comandos Útiles

```bash
# Subir frontend a S3
aws s3 sync public/ s3://newolx-frontend-681432799230/ --region us-east-2

# Crear zip para Lambda
zip -r lambda.zip . -x '__tests__/*' '__testsBackend__/*' 'public/*' 'uploads/*' '.git/*' 'aws/*' '*.md'

# Actualizar Lambda
aws lambda update-function-code --function-name newolx-backend --zip-file fileb://lambda.zip --region us-east-2

# Probar API
curl https://d3oxqm7f3a7rlu.cloudfront.net/api/ventas
curl https://d3oxqm7f3a7rlu.cloudfront.net/api/uploads/presigned?extension=.jpg
```

## Variables de Entorno

| Variable | Valor | Dónde |
|---|---|---|
| `AWS_REGION` | `us-east-2` | Lambda environment variables |
