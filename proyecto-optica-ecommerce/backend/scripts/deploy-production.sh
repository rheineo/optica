#!/bin/bash

# ===========================================
# Script de Despliegue para Producción
# Liney Visión - Backend
# ===========================================

echo "🚀 Iniciando despliegue en producción..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Ejecuta este script desde el directorio backend"
    exit 1
fi

# Verificar que DATABASE_URL está configurada
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL no está configurada"
    exit 1
fi

echo "📦 Instalando dependencias..."
npm ci --production=false

echo "🔧 Generando cliente de Prisma..."
npx prisma generate

echo "📊 Actualizando estructura de base de datos..."
echo "⚠️  IMPORTANTE: Este comando NO borra datos existentes"
npx prisma db push --accept-data-loss=false

echo "✅ Estructura de base de datos actualizada"

echo "🏗️  Compilando TypeScript..."
npm run build

echo "🎉 Despliegue completado exitosamente!"
echo ""
echo "📝 Notas:"
echo "   - Los datos existentes se mantienen intactos"
echo "   - Nuevos campos se agregan como NULL"
echo "   - Ejecuta 'npm start' para iniciar el servidor"
