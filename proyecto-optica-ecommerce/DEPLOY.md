# Guía de Despliegue - Liney Visión

## Stack de Despliegue (Gratuito)

| Componente | Servicio | Plan |
|------------|----------|------|
| Base de Datos | Neon | Free (0.5 GB) |
| Backend | Render | Free (750 hrs/mes) |
| Frontend | Vercel | Free (ilimitado) |
| Imágenes | Cloudinary | Free (25 GB) |

---

## 1. Base de Datos - Neon ✅ (Ya configurado)

**URL de conexión:**
```
postgresql://neondb_owner:npg_gH7fAbZSql1K@ep-broad-dew-ah5cdytb-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Credenciales de prueba:**
- Admin: `admin@optivision.com` / `Admin123!`
- Cliente: `juan.perez@email.com` / `Cliente123!`

---

## 2. Backend - Render

### Pasos:

1. Ir a [render.com](https://render.com) y crear cuenta
2. Click en **New** → **Web Service**
3. Conectar tu repositorio de GitHub
4. Configurar:
   - **Name**: `lineyvision-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Variables de Entorno (Environment Variables):

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `4000` |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_gH7fAbZSql1K@ep-broad-dew-ah5cdytb-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | `lineyvision_jwt_secret_prod_2024_secure_key` |
| `JWT_EXPIRES_IN` | `7d` |
| `CLOUDINARY_CLOUD_NAME` | `dadryt5w7` |
| `CLOUDINARY_API_KEY` | `237391158137483` |
| `CLOUDINARY_API_SECRET` | `Udvh_JDkeKNjtpZxIWSaSxFK71s` |

5. Click en **Create Web Service**
6. Esperar a que se complete el deploy (~5 min)
7. Copiar la URL generada (ej: `https://lineyvision-api.onrender.com`)

---

## 3. Frontend - Vercel

### Pasos:

1. Ir a [vercel.com](https://vercel.com) y crear cuenta
2. Click en **Add New** → **Project**
3. Importar tu repositorio de GitHub
4. Configurar:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`

### Variables de Entorno:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://lineyvision-api.onrender.com` (la URL de Render) |

5. Click en **Deploy**
6. Esperar a que se complete (~2 min)

---

## 4. Actualizar CORS en Backend

Una vez tengas la URL del frontend en Vercel, actualiza la variable `FRONTEND_URL` en Render:

| Key | Value |
|-----|-------|
| `FRONTEND_URL` | `https://tu-proyecto.vercel.app` |

---

## Notas Importantes

### Render (Plan Free)
- El servidor se "duerme" después de 15 minutos de inactividad
- La primera petición después de dormir tarda ~30 segundos
- 750 horas gratis por mes

### Neon (Plan Free)
- 0.5 GB de almacenamiento
- Compute se suspende después de 5 minutos de inactividad
- 191.9 horas de compute por mes

### Para evitar que se duerman:
Puedes usar servicios como [UptimeRobot](https://uptimerobot.com) para hacer ping cada 5 minutos (gratis).

---

## URLs Finales (Ejemplo)

- **Frontend**: https://lineyvision.vercel.app
- **Backend API**: https://lineyvision-api.onrender.com
- **API Docs**: https://lineyvision-api.onrender.com/api-docs

---

## Comandos Útiles

```bash
# Migrar schema a Neon (desde local)
DATABASE_URL="postgresql://..." npx prisma db push

# Ejecutar seed en Neon
DATABASE_URL="postgresql://..." npx ts-node prisma/seed.ts

# Ver base de datos
DATABASE_URL="postgresql://..." npx prisma studio
```
