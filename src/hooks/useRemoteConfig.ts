import { useEffect, useState } from "react";
import { remoteConfig } from "../firebase-config";
import { fetchAndActivate, getValue } from "firebase/remote-config";

// Para objetos JSON
// const configObject = useRemoteConfig<{theme: string, features: string[]}>('app_config', 'json');

type RemoteConfigValueType = 'string' | 'number' | 'boolean' | 'json';
const useRemoteConfig = <T = string>(
  key: string, 
  valueType: RemoteConfigValueType = 'string'
) => {
  const [value, setValue] = useState<T | undefined>();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        await fetchAndActivate(remoteConfig);
        const remoteValue = getValue(remoteConfig, key);
        
        let fetchedValue: T;
        switch (valueType) {
          case 'boolean':
            fetchedValue = remoteValue.asBoolean() as T;
            break;
          case 'number':
            fetchedValue = remoteValue.asNumber() as T;
            break;
          case 'json':
            try {
              fetchedValue = JSON.parse(remoteValue.asString()) as T;
            } catch {
              console.error(`Failed to parse JSON for key: ${key}`);
              fetchedValue = undefined as T;
            }
            break;
          case 'string':
          default:
            fetchedValue = remoteValue.asString() as T;
            break;
        }
        
        setValue(fetchedValue);
      } catch (error) {
        console.error("Failed to fetch Remote Config", error);
      }
    };

    fetchConfig();
  }, [key, valueType]);

  return value;
};

export default useRemoteConfig;