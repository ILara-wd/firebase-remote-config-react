import { initializeApp } from "firebase/app";
import { getRemoteConfig } from "firebase/remote-config";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBxtQr1CUtV3mbjbJYfin3m3KVhHvUrIaQ",
  authDomain: "hangman-8c7fc.firebaseapp.com",
  projectId: "hangman-8c7fc",
  storageBucket: "hangman-8c7fc.firebasestorage.app",
  messagingSenderId: "172039076088",
  appId: "1:172039076088:web:c94ece6382c378c908630d",
  measurementId: "G-VV1T5ZPJ0K"
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