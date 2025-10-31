import { initializeApp } from "firebase/app";
import { getRemoteConfig } from "firebase/remote-config";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Remote Config
const remoteConfig = getRemoteConfig(app);

remoteConfig.settings = {
  minimumFetchIntervalMillis: 5000, // 5 seconds for testing only
  fetchTimeoutMillis: 5000, // 5 seconds for testing only
};

export { remoteConfig };
