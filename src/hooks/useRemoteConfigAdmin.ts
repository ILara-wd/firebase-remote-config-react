import { useState } from 'react';

interface RemoteConfigValue {
  key: string;
  value: string;
  valueType: 'string' | 'number' | 'boolean' | 'json';
}

interface RemoteConfigTemplate {
  parameters: Record<string, {
    defaultValue: { value: string };
    valueType: string;
  }>;
  versionNumber: string;
}

const useRemoteConfigAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateRemoteConfig = async (configs: RemoteConfigValue[]) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Intentando actualizar Remote Config...', configs);
      
      const response = await fetch('http://localhost:3001/api/remote-config/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ configs })
      });

      console.log('📡 Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error del servidor:', errorData);
        throw new Error(`Failed to update remote config: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('✅ Actualización exitosa:', result);
      return result;
    } catch (err) {
      console.error('💥 Error completo:', err);
      let errorMessage = 'Error desconocido';
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3001';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRemoteConfigTemplate = async (): Promise<RemoteConfigTemplate> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Intentando obtener template...');
      
      const response = await fetch('http://localhost:3001/api/remote-config/template', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      console.log('📡 Respuesta del servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Error del servidor:', errorData);
        throw new Error(`Failed to get remote config template: ${response.status} - ${errorData}`);
      }
      
      const result = await response.json();
      console.log('✅ Template obtenido:', result);
      return result;
    } catch (err) {
      console.error('💥 Error completo:', err);
      let errorMessage = 'Error desconocido';
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo en http://localhost:3001';
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const publishTemplate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/remote-config/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to publish template: ${errorData}`);
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateRemoteConfig,
    getRemoteConfigTemplate,
    publishTemplate,
    loading,
    error
  };
};

export default useRemoteConfigAdmin;
