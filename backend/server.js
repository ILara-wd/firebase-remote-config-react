const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware mejorado para CORS
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:3000', 
    'http://localhost:4173',
    'http://localhost:8080'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Middleware adicional para manejar preflight requests
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

app.use(express.json());

// Inicializar Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require('./hangman-8c7fc-firebase-adminsdk-a60dp-bdaddafc6f.json');
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });
  
  console.log('✅ Firebase Admin SDK inicializado correctamente');
  console.log('📋 Project ID:', serviceAccount.project_id);
}

// Middleware para logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Endpoint para obtener el template actual de Remote Config
app.get('/api/remote-config/template', async (req, res) => {
  try {
    console.log('🔍 Obteniendo template de Remote Config...');
    const template = await admin.remoteConfig().getTemplate();
    
    console.log('✅ Template obtenido exitosamente. Versión:', template.versionNumber);
    console.log('📦 Parámetros encontrados:', Object.keys(template.parameters).length);
    
    res.json({
      parameters: template.parameters,
      versionNumber: template.versionNumber,
      etag: template.etag
    });
  } catch (error) {
    console.error('❌ Error obteniendo template:', error.message);
    res.status(500).json({ 
      error: 'Error obteniendo template de Remote Config',
      details: error.message 
    });
  }
});

// Endpoint para actualizar Remote Config
app.post('/api/remote-config/update', async (req, res) => {
  try {
    const { configs } = req.body;
    
    if (!configs || !Array.isArray(configs)) {
      return res.status(400).json({ error: 'Configs debe ser un array' });
    }

    console.log('🔧 Actualizando Remote Config con', configs.length, 'parámetros...');
    
    // Obtener template actual
    const template = await admin.remoteConfig().getTemplate();
    console.log('📋 Template actual versión:', template.versionNumber);
    
    // Actualizar parámetros
    configs.forEach(config => {
      if (!config.key || config.value === undefined) {
        throw new Error(`Configuración inválida: key="${config.key}", value="${config.value}"`);
      }

      console.log(`📝 Actualizando parámetro: ${config.key} = ${config.value} (${config.valueType})`);
      
      // Validar JSON si es necesario
      if (config.valueType === 'json') {
        try {
          JSON.parse(config.value);
        } catch (e) {
          throw new Error(`Valor JSON inválido para la clave "${config.key}": ${e.message}`);
        }
      }
      
      template.parameters[config.key] = {
        defaultValue: {
          value: config.value
        },
        valueType: config.valueType.toUpperCase()
      };
    });
    
    // Publicar template actualizado
    console.log('🚀 Publicando template actualizado...');
    const updatedTemplate = await admin.remoteConfig().publishTemplate(template);
    
    console.log('✅ Remote Config actualizado exitosamente!');
    console.log('🔢 Nueva versión:', updatedTemplate.versionNumber);
    
    res.json({ 
      success: true, 
      versionNumber: updatedTemplate.versionNumber,
      message: `Remote Config actualizado a la versión ${updatedTemplate.versionNumber}`
    });
  } catch (error) {
    console.error('❌ Error actualizando Remote Config:', error.message);
    res.status(500).json({ 
      error: 'Error actualizando Remote Config',
      details: error.message 
    });
  }
});

// Endpoint para publicar template (sin cambios)
app.post('/api/remote-config/publish', async (req, res) => {
  try {
    console.log('🚀 Publicando template actual...');
    const template = await admin.remoteConfig().getTemplate();
    const publishedTemplate = await admin.remoteConfig().publishTemplate(template);
    
    console.log('✅ Template publicado exitosamente!');
    console.log('🔢 Versión:', publishedTemplate.versionNumber);
    
    res.json({ 
      success: true, 
      versionNumber: publishedTemplate.versionNumber,
      message: `Template publicado como versión ${publishedTemplate.versionNumber}`
    });
  } catch (error) {
    console.error('❌ Error publicando template:', error.message);
    res.status(500).json({ 
      error: 'Error publicando template',
      details: error.message 
    });
  }
});

// Endpoint para obtener información del proyecto
app.get('/api/project-info', (req, res) => {
  const serviceAccount = require('./hangman-8c7fc-firebase-adminsdk-a60dp-bdaddafc6f.json');
  res.json({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    status: 'connected'
  });
});

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'firebase-remote-config-backend'
  });
});

// Endpoint raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'Firebase Remote Config Backend API',
    version: '1.0.0',
    endpoints: {
      'GET /health': 'Health check',
      'GET /api/project-info': 'Información del proyecto',
      'GET /api/remote-config/template': 'Obtener template actual',
      'POST /api/remote-config/update': 'Actualizar configuraciones',
      'POST /api/remote-config/publish': 'Publicar template'
    }
  });
});

// Manejo de errores globales
app.use((error, req, res, next) => {
  console.error('💥 Error no manejado:', error);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    details: error.message 
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.originalUrl 
  });
});

app.listen(PORT, () => {
  console.log('\n🚀 Servidor iniciado exitosamente!');
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🕒 Hora: ${new Date().toISOString()}`);
  console.log('\n📋 Endpoints disponibles:');
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   GET  http://localhost:${PORT}/api/project-info`);
  console.log(`   GET  http://localhost:${PORT}/api/remote-config/template`);
  console.log(`   POST http://localhost:${PORT}/api/remote-config/update`);
  console.log(`   POST http://localhost:${PORT}/api/remote-config/publish`);
  console.log('\n🔥 Backend listo para administrar Firebase Remote Config!\n');
});

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Recibida señal SIGINT, cerrando servidor...');
  process.exit(0);
});