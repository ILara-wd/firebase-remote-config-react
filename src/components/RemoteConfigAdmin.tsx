import React, { useState } from 'react';
import useRemoteConfigAdmin from '../hooks/useRemoteConfigAdmin';

interface ConfigItem {
  key: string;
  value: string;
  valueType: 'string' | 'number' | 'boolean' | 'json';
}

const RemoteConfigAdmin: React.FC = () => {
  const [configs, setConfigs] = useState<ConfigItem[]>([
    { key: 'forceUpdate', value: 'false', valueType: 'boolean' },
    { key: 'versionName', value: '1.0.0', valueType: 'string' },
    { key: 'versionCode', value: '1', valueType: 'number' },
    { key: 'app_name_state', value: 'default', valueType: 'string' },
    { key: 'app_config', value: '{}', valueType: 'json' }
  ]);
  
  const { updateRemoteConfig, getRemoteConfigTemplate, publishTemplate, loading, error } = useRemoteConfigAdmin();
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleConfigChange = (index: number, field: keyof ConfigItem, value: string) => {
    const newConfigs = [...configs];
    newConfigs[index] = { ...newConfigs[index], [field]: value };
    setConfigs(newConfigs);
  };

  const addNewConfig = () => {
    setConfigs([...configs, { key: '', value: '', valueType: 'string' }]);
  };

  const removeConfig = (index: number) => {
    setConfigs(configs.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    
    try {
      // Validar que todos los campos estén llenos
      const invalidConfigs = configs.filter(config => !config.key.trim() || !config.value.trim());
      if (invalidConfigs.length > 0) {
        alert('Por favor, completa todos los campos de configuración');
        return;
      }

      // Validar JSON para campos de tipo json
      for (const config of configs) {
        if (config.valueType === 'json') {
          try {
            JSON.parse(config.value);
          } catch {
            alert(`El valor para la clave '${config.key}' no es un JSON válido`);
            return;
          }
        }
      }

      const result = await updateRemoteConfig(configs);
      setSuccessMessage(`Remote Config actualizado exitosamente! Versión: ${result.versionNumber}`);
      
      // Auto-ocultar mensaje después de 5 segundos
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };

  const loadCurrentTemplate = async () => {
    try {
      const template = await getRemoteConfigTemplate();
      
      // Convertir template a formato de configuración
      const loadedConfigs: ConfigItem[] = Object.entries(template.parameters).map(([key, param]) => ({
        key,
        value: param.defaultValue.value,
        valueType: param.valueType.toLowerCase() as ConfigItem['valueType']
      }));
      
      setConfigs(loadedConfigs);
      setSuccessMessage(`Template cargado exitosamente! Versión: ${template.versionNumber}`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to load template:', err);
    }
  };

  const handlePublish = async () => {
    try {
      const result = await publishTemplate();
      setSuccessMessage(`Template publicado exitosamente! Versión: ${result.versionNumber}`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Failed to publish:', err);
    }
  };

  const validateJsonInput = (value: string): boolean => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '900px', 
      margin: '0 auto',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>🔧 Remote Config Admin Panel</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={loadCurrentTemplate} 
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Cargando...' : 'Cargar Template Actual'}
        </button>
        
        <button 
          onClick={handlePublish} 
          disabled={loading}
          style={{
            padding: '10px 15px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Publicando...' : 'Publicar Template'}
        </button>
      </div>
      
      {error && (
        <div style={{ 
          color: '#f44336', 
          backgroundColor: '#ffebee',
          padding: '10px',
          borderRadius: '4px',
          margin: '10px 0',
          border: '1px solid #f44336'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {successMessage && (
        <div style={{ 
          color: '#4CAF50', 
          backgroundColor: '#e8f5e8',
          padding: '10px',
          borderRadius: '4px',
          margin: '10px 0',
          border: '1px solid #4CAF50'
        }}>
          <strong>✅ Éxito:</strong> {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <h3 style={{ color: '#555', marginBottom: '15px' }}>Configuraciones:</h3>
        
        {configs.map((config, index) => (
          <div key={index} style={{ 
            border: '1px solid #ddd', 
            padding: '15px', 
            margin: '10px 0',
            borderRadius: '6px',
            backgroundColor: 'white'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px', gap: '10px', alignItems: 'start' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
                  Clave:
                </label>
                <input
                  type="text"
                  placeholder="ej: forceUpdate"
                  value={config.key}
                  onChange={(e) => handleConfigChange(index, 'key', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
                  Tipo:
                </label>
                <select
                  value={config.valueType}
                  onChange={(e) => handleConfigChange(index, 'valueType', e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '8px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="json">JSON</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'end' }}>
                <button 
                  type="button" 
                  onClick={() => removeConfig(index)}
                  style={{ 
                    padding: '8px 12px', 
                    backgroundColor: '#f44336', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div style={{ marginTop: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' }}>
                Valor:
              </label>
              <textarea
                placeholder={
                  config.valueType === 'json' 
                    ? '{"ejemplo": "valor", "activo": true}' 
                    : config.valueType === 'boolean'
                    ? 'true o false'
                    : config.valueType === 'number'
                    ? '123'
                    : 'Texto aquí'
                }
                value={config.value}
                onChange={(e) => handleConfigChange(index, 'value', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px',
                  minHeight: config.valueType === 'json' ? '100px' : '40px',
                  border: config.valueType === 'json' && config.value && !validateJsonInput(config.value) 
                    ? '2px solid #f44336' 
                    : '1px solid #ccc',
                  borderRadius: '4px',
                  fontFamily: config.valueType === 'json' ? 'monospace' : 'inherit'
                }}
              />
              {config.valueType === 'json' && config.value && !validateJsonInput(config.value) && (
                <small style={{ color: '#f44336' }}>⚠️ JSON no válido</small>
              )}
            </div>
          </div>
        ))}
        
        <div style={{ margin: '20px 0', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            type="button" 
            onClick={addNewConfig}
            style={{ 
              padding: '10px 15px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ➕ Agregar Nueva Configuración
          </button>
          
          <button 
            type="submit" 
            disabled={loading || configs.some(c => !c.key.trim() || !c.value.trim())}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: loading || configs.some(c => !c.key.trim() || !c.value.trim()) ? '#ccc' : '#2196F3', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px',
              cursor: loading || configs.some(c => !c.key.trim() || !c.value.trim()) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '⏳ Actualizando...' : '💾 Actualizar Remote Config'}
          </button>
        </div>
      </form>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#e3f2fd', 
        borderRadius: '4px',
        border: '1px solid #2196F3'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1976D2' }}>ℹ️ Instrucciones:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#555' }}>
          <li>Usa "Cargar Template Actual" para obtener las configuraciones actuales de Firebase</li>
          <li>Modifica los valores según necesites</li>
          <li>Para valores JSON, asegúrate de que tengan formato JSON válido</li>
          <li>Haz clic en "Actualizar Remote Config" para guardar los cambios</li>
          <li>Los cambios se aplicarán automáticamente a tu aplicación</li>
        </ul>
      </div>
    </div>
  );
};

export default RemoteConfigAdmin;
