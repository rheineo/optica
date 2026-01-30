# ===========================================
# Script de Despliegue para Producción (Windows)
# Liney Visión - Backend
# ===========================================

Write-Host "🚀 Iniciando despliegue en producción..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Ejecuta este script desde el directorio backend" -ForegroundColor Red
    exit 1
}

# Verificar que DATABASE_URL está configurada
if (-not $env:DATABASE_URL) {
    Write-Host "❌ Error: DATABASE_URL no está configurada" -ForegroundColor Red
    Write-Host "   Configura la variable de entorno o usa un archivo .env" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
npm ci --production=false

Write-Host "🔧 Generando cliente de Prisma..." -ForegroundColor Yellow
npx prisma generate

Write-Host "📊 Actualizando estructura de base de datos..." -ForegroundColor Yellow
Write-Host "⚠️  IMPORTANTE: Este comando NO borra datos existentes" -ForegroundColor Magenta
npx prisma db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al actualizar la base de datos" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Estructura de base de datos actualizada" -ForegroundColor Green

Write-Host "🏗️  Compilando TypeScript..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al compilar" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Despliegue completado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Notas:" -ForegroundColor Cyan
Write-Host "   - Los datos existentes se mantienen intactos"
Write-Host "   - Nuevos campos se agregan como NULL"
Write-Host "   - Ejecuta 'npm start' para iniciar el servidor"
