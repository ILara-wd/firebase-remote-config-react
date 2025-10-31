# React + TypeScript + Vite + Firebase (Remote Config)
Aplicación para la administración del remote config de firebase

Se debe realizar la instalación de node_module & firebase

```bash
npm install
```

```bash
npm install firebase
```

Para ejecutar local con este comando para front desde la raíz y para backend /backend
```bash
npm run dev
```

Para otorgar permisos y poder realizar la actualización de remote config

https://console.cloud.google.com/iam-admin/iam?project=projectId

Para realizar la configuración de los parámetros de Remote Config, se encuentra este archivo 
  
```typescript
  RemoteConfigAdmin{
  		...
  		{ key: 'forceUpdate', value: 'false', valueType: 'boolean' },
  		...
  }
```

Archivo para la configuración de firebase backend/.env

```bash
# Configuración del proyecto Firebase
FIREBASE_PROJECT_ID=proyect-id

# Ruta al archivo de credenciales del servicio de Firebase (archivo JSON)
# Descárgalo desde Firebase Console > Project Settings > Service Accounts
FIREBASE_SERVICE_ACCOUNT_PATH=.proyect-id-file.json

# Puerto del servidor (opcional, por defecto 3001)
PORT=3001

# Entorno
NODE_ENV=development
```

Archivo para la configuración de firebase en la app front firebase-config.ts

```typescript
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1Y7Yy3Yk1bX1F3b3QZg4x8x8x8x8x8x8",
  authDomain: "project-id.firebaseapp.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "909090909090",
  appId: "1:0000000:web:xxxxxxxxyyyyyyyyyyyyyyy",
  measurementId: "G-XXXXXXX",
};
```
## Configuración de Firebase

### 1. Obtener configuración de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto o crea uno nuevo
3. Ve a **Configuración del proyecto** ⚙️ > **General**
4. En la sección **"Tus apps"**, haz clic en `</>` para agregar una app web
5. Copia la configuración que aparece

### 2. Configurar el proyecto

Reemplaza los valores en `src/firebase-config.ts` con tu configuración real:

```typescript
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-ABCDEF123"
};
```

Nota importante: Mantén estos valores seguros y no los compartas públicamente, especialmente la apiKey.

| Visualización | Administración |
|-------------|-------------|
| <img width="621" height="744" alt="0a9sd809a8d0asd" src="https://github.com/user-attachments/assets/ca99b433-1c20-429e-ae17-9dc7729bf684" /> | <img width="269" height="564" alt="ad879as7d9a7sd97ad9aa" src="https://github.com/user-attachments/assets/af74aad5-1578-4015-841e-38a783f95cac" /> |

