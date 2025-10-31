#!/bin/bash

echo "🚀 Iniciando Firebase Remote Config Admin System"
echo "================================================"

# Verificar si estamos en el directorio correcto
if [ ! -d "backend" ]; then
    echo "❌ Error: No se encontró el directorio 'backend'"
    echo "   Asegúrate de ejecutar este script desde el directorio raíz del proyecto"
    exit 1
fi

# Verificar si existe el archivo de credenciales
if [ ! -f "backend/hangman-8c7fc-firebase-adminsdk-a60dp-bdaddafc6f.json" ]; then
    echo "❌ Error: No se encontró el archivo de credenciales de Firebase"
    echo "   Verifica que el archivo esté en: backend/hangman-8c7fc-firebase-adminsdk-a60dp-bdaddafc6f.json"
    exit 1
fi

echo "✅ Directorio correcto y credenciales encontradas"

# Verificar si el puerto 3001 está libre
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  El puerto 3001 ya está en uso"
    echo "   Matando proceso anterior..."
    lsof -ti:3001 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

echo "🔧 Iniciando servidor backend en puerto 3001..."
cd backend

# Verificar si las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    npm install
fi

echo "🚀 Servidor iniciado!"
echo "📡 URL: http://localhost:3001"
echo "🌐 Abrir test de CORS: file://$(pwd)/../cors-test.html"
echo ""
echo "Para probar:"
echo "1. Abre tu navegador en http://localhost:5173 (frontend)"
echo "2. O abre cors-test.html para probar conectividad"
echo "3. Presiona Ctrl+C para detener el servidor"
echo ""

# Iniciar el servidor
node server.js