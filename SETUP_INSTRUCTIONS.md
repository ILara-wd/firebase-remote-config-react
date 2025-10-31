# 🔧 Firebase Remote Config Admin Panel

## 📋 Resumen
Este proyecto te permite administrar las configuraciones de Firebase Remote Config directamente desde tu aplicación web. Incluye un panel de administración completo con capacidades para crear, leer, actualizar y publicar configuraciones.

## 🏗️ Arquitectura del Sistema

### Frontend (React + TypeScript)
- **Hook personalizado**: `useRemoteConfig` - Para leer configuraciones
- **Hook de administración**: `useRemoteConfigAdmin` - Para gestionar configuraciones  
- **Componente Admin**: `RemoteConfigAdmin` - Panel de administración visual
- **Soporte completo de tipos**: string, number, boolean, json

### Backend (Node.js + Express + Firebase Admin SDK)
- **API RESTful** para operaciones CRUD de Remote Config
- **Firebase Admin SDK** para acceso privilegiado
- **CORS configurado** para comunicación frontend-backend
- **Validación de datos** y manejo de errores

## 🚀 Configuración e Instalación

### 1. Configurar el Backend

```bash
# Ir al directorio del backend
cd backend

# Instalar dependencias
npm install

# Iniciar el servidor
node server.js
```

El servidor se iniciará en `http://localhost:3001`

### 2. Configurar el Frontend

```bash
# Ir al directorio raíz del proyecto
cd ..

# Instalar dependencias (si no están instaladas)
npm install

# Iniciar la aplicación React
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`

## 📡 Endpoints de la API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check del servidor |
| GET | `/api/project-info` | Información del proyecto Firebase |
| GET | `/api/remote-config/template` | Obtener template actual |
| POST | `/api/remote-config/update` | Actualizar configuraciones |
| POST | `/api/remote-config/publish` | Publicar template |

## 🎯 Uso del Panel de Administración

### 1. Acceder al Panel
- Abre tu aplicación React
- Haz clic en "⚙️ Mostrar Panel Admin"

### 2. Cargar Configuraciones Actuales
- Clic en "Cargar Template Actual"
- Se cargarán las configuraciones existentes de Firebase

### 3. Editar Configuraciones
- **Clave**: Nombre del parámetro (ej: `forceUpdate`)
- **Tipo**: string, number, boolean, json
- **Valor**: El valor correspondiente

### 4. Validación de Datos
- **JSON**: Se valida automáticamente el formato
- **Campos obligatorios**: No se pueden enviar campos vacíos
- **Tipos**: Se respetan los tipos de datos especificados

### 5. Guardar Cambios
- Clic en "💾 Actualizar Remote Config"
- Los cambios se aplicarán inmediatamente
- Se mostrará la nueva versión del template

## 🔧 Hooks Disponibles

### useRemoteConfig
```typescript
// Para strings
const appName = useRemoteConfig<string>('app_name', 'string');

// Para números
const maxRetries = useRemoteConfig<number>('max_retries', 'number');

// Para booleanos
const isEnabled = useRemoteConfig<boolean>('feature_enabled', 'boolean');

// Para objetos JSON
const config = useRemoteConfig<{theme: string, color: string}>('ui_config', 'json');
```

### useRemoteConfigAdmin
```typescript
const { 
  updateRemoteConfig, 
  getRemoteConfigTemplate, 
  publishTemplate, 
  loading, 
  error 
} = useRemoteConfigAdmin();

// Actualizar configuraciones
await updateRemoteConfig([
  { key: 'forceUpdate', value: 'true', valueType: 'boolean' },
  { key: 'versionName', value: '2.0.0', valueType: 'string' }
]);
```

## 🔒 Seguridad

### Autenticación
- El backend usa Firebase Admin SDK con credenciales de servicio
- Solo usuarios con acceso al panel pueden modificar configuraciones

### Validación
- Todos los valores JSON se validan antes del envío
- Tipos de datos se verifican en el frontend y backend
- Manejo de errores robusto con mensajes descriptivos

## 🐛 Troubleshooting

### Error: "Failed to fetch"
- **Causa**: Backend no está ejecutándose
- **Solución**: Ejecutar `node server.js` en el directorio `backend`

### Error: "Firebase Admin SDK"
- **Causa**: Archivo de credenciales no encontrado o inválido
- **Solución**: Verificar que `hangman-8c7fc-firebase-adminsdk-a60dp-bdaddafc6f.json` existe

### Error: "CORS"
- **Causa**: Problema de CORS entre frontend y backend
- **Solución**: Verificar que el backend esté configurado para aceptar requests del frontend

### Error: "JSON inválido"
- **Causa**: Formato JSON malformado en campos de tipo JSON
- **Solución**: Usar un validador JSON o revisar sintaxis

## 📁 Estructura de Archivos

```
firebase-remote-config/
├── src/
│   ├── hooks/
│   │   ├── useRemoteConfig.ts          # Hook para leer configs
│   │   └── useRemoteConfigAdmin.ts     # Hook para administrar configs
│   ├── components/
│   │   └── RemoteConfigAdmin.tsx       # Panel de administración
│   └── App.tsx                         # Aplicación principal
├── backend/
│   ├── server.js                       # Servidor Express + Firebase Admin
│   ├── package.json                    # Dependencias backend
│   └── hangman-8c7fc-firebase-adminsdk-a60dp-bdaddafc6f.json  # Credenciales
└── SETUP_INSTRUCTIONS.md              # Este archivo
```

## 🎉 Características

### ✅ Implementado
- ✅ Lectura de Remote Config con tipos
- ✅ Panel de administración visual
- ✅ CRUD completo de configuraciones
- ✅ Validación de JSON en tiempo real
- ✅ Manejo de errores robusto
- ✅ UI responsive y amigable
- ✅ Logging detallado en backend
- ✅ Health checks y monitoring

### 🚀 Posibles Mejoras Futuras
- 🔄 Auto-refresh de configuraciones
- 👥 Sistema de autenticación de usuarios
- 📊 Historial de cambios
- 🌍 Soporte para múltiples entornos
- 📱 App móvil para administración
- 🔔 Notificaciones de cambios

## 📞 Soporte

Si encuentras algún problema:

1. **Revisar logs**: Los logs del servidor muestran información detallada
2. **Verificar endpoints**: Usar `curl` para probar la API directamente
3. **Validar JSON**: Usar herramientas online para validar formato JSON
4. **Revisar credenciales**: Asegurar que el archivo de credenciales es correcto

---

🎯 **¡Tu sistema está listo!** Ahora puedes administrar Firebase Remote Config fácilmente desde tu aplicación web.