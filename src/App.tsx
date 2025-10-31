import React, { useState } from "react";
import useRemoteConfig from "./hooks/useRemoteConfig";
import RemoteConfigAdmin from "./components/RemoteConfigAdmin";
import ServerConnectionTest from "./components/ServerConnectionTest";

const App: React.FC = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  
  // Get the feature flag values with proper types
  const forceUpdate = useRemoteConfig<boolean>("forceUpdate", "boolean");
  const versionName = useRemoteConfig<string>("versionName", "string");
  const versionCode = useRemoteConfig<number>("versionCode", "number");
  const app_name_state = useRemoteConfig<string>("app_name_state", "string");
  
  console.log('Remote Config Values:', { forceUpdate, versionName, versionCode, app_name_state });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🚀 Welcome to Our App!</h1>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={() => setShowAdmin(!showAdmin)}
          style={{
            padding: '10px 20px',
            backgroundColor: showAdmin ? '#f44336' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {showAdmin ? '❌ Ocultar Panel Admin' : '⚙️ Mostrar Panel Admin'}
        </button>
      </div>
      
      {showAdmin && (
        <div style={{ marginBottom: '30px' }}>
          <ServerConnectionTest />
          <RemoteConfigAdmin />
        </div>
      )}
      
      <div style={{ 
        backgroundColor: '#e8f4f8', 
        padding: '20px', 
        margin: '20px 0',
        borderRadius: '8px',
        border: '2px solid #2196F3'
      }}>
        <h3 style={{ color: '#1976D2', marginTop: 0 }}>📋 Valores Actuales de Remote Config:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <strong style={{ fontSize: '18px', color: '#333' }}>🔄 Force Update:</strong>
            <div style={{ fontSize: '18px', color: forceUpdate ? '#4CAF50' : '#f44336' }}>
              {forceUpdate !== undefined ? String(forceUpdate) : '⏳ Cargando...'}
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <strong style={{ fontSize: '18px', color: '#333' }}>📱 Version Name:</strong>
            <div style={{ fontSize: '18px', color: '#333' }}>
              {versionName || '⏳ Cargando...'}
            </div>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <strong style={{ fontSize: '18px', color: '#333' }}>🔢 Version Code:</strong>
            <div style={{ fontSize: '18px', color: '#333' }}>
              {versionCode !== undefined ? versionCode : '⏳ Cargando...'}
            </div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <strong style={{ fontSize: '18px', color: '#333' }}>🏷️ App Name State:</strong>
            <div style={{ fontSize: '18px', color: '#333' }}>
              {app_name_state || '⏳ Cargando...'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: forceUpdate ? '#e8f5e8' : '#ffebee', 
        padding: '20px',
        borderRadius: '8px',
        border: `2px solid ${forceUpdate ? '#4CAF50' : '#f44336'}`,
        textAlign: 'center'
      }}>
        {forceUpdate ? (
          <div>
            <h2 style={{ color: '#4CAF50', margin: '0 0 10px 0' }}>✅ Actualización Forzada Activada</h2>
            <p style={{ fontSize: '18px', margin: 0, color: '#4CAF50'}}>
              Los usuarios deben actualizar la aplicación a la versión <strong>{versionName}</strong> (código: {versionCode})
            </p>
          </div>
        ) : (
          <div>
            <h2 style={{ color: '#f44336', margin: '0 0 10px 0' }}>❌ Actualización Forzada Desactivada</h2>
            <p style={{ color: '#f44336',fontSize: '18px', margin: 0 }}>
              Los usuarios pueden usar la versión actual de la aplicación
            </p>
          </div>
        )}
      </div>

      <div style={{ 
        marginTop: '30px', 
        padding: '15px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '5px',
        fontSize: '14px',
        color: '#666'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>💡 Cómo usar:</h4>
        <ol style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Haz clic en "Mostrar Panel Admin" para abrir el panel de administración</li>
          <li>Usa "Cargar Template Actual" para obtener las configuraciones de Firebase</li>
          <li>Modifica los valores según necesites</li>
          <li>Haz clic en "Actualizar Remote Config" para guardar los cambios</li>
          <li>Los cambios se reflejarán automáticamente en esta página</li>
        </ol>
      </div>
    </div>
  );
};

export default App;