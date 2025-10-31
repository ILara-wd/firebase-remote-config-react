import React, { useState } from 'react';

const ServerConnectionTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnection = async () => {
    setIsLoading(true);
    setTestResult('Probando conexión...');
    
    try {
      console.log('🔍 Probando conexión al servidor...');
      
      const response = await fetch('http://localhost:3001/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });
      
      console.log('📡 Respuesta:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ Conexión exitosa! Servidor: ${data.service} - Estado: ${data.status}`);
      } else {
        setTestResult(`❌ Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('💥 Error de conexión:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setTestResult('❌ No se puede conectar con el servidor. Verifica que esté corriendo en http://localhost:3001');
      } else {
        setTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      margin: '20px 0', 
      padding: '15px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '5px',
      border: '1px solid #ccc'
    }}>
      <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>🔧 Test de Conectividad del Servidor</h4>
      
      <button 
        onClick={testConnection}
        disabled={isLoading}
        style={{
          padding: '8px 15px',
          backgroundColor: isLoading ? '#ccc' : '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginBottom: '10px'
        }}
      >
        {isLoading ? '⏳ Probando...' : '🚀 Probar Conexión'}
      </button>
      
      {testResult && (
        <div style={{ 
          padding: '10px', 
          color: testResult.includes('✅') ? '#256029' : '#c62828',
          backgroundColor: testResult.includes('✅') ? '#e8f5e8' : '#ffebee',
          border: `1px solid ${testResult.includes('✅') ? '#4CAF50' : '#f44336'}`,
          borderRadius: '4px',
          marginTop: '10px'
        }}>
          {testResult}
        </div>
      )}
      
      <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        <strong>Instrucciones:</strong>
        <ol style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li>Asegúrate de que el backend esté corriendo: <code>cd backend && node server.js</code></li>
          <li>Verifica que no hay errores de CORS en la consola del navegador</li>
          <li>El servidor debe estar en <code>http://localhost:3001</code></li>
        </ol>
      </div>
    </div>
  );
};

export default ServerConnectionTest;