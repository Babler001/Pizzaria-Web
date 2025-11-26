import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração copiada da tua imagem:
const firebaseConfig = {
  apiKey: "AIzaSyBbEdQOtaoRSU7H6BpmBbTom8R7CbN_SuI",
  authDomain: "pizzaria-b1138.firebaseapp.com",
  projectId: "pizzaria-b1138",
  storageBucket: "pizzaria-b1138.firebasestorage.app",
  messagingSenderId: "322738943170",
  appId: "1:322738943170:web:bd81bc3e3fceaf3c01375b",
  measurementId: "G-SJVMCF1BZX"
};

// Inicializar o Firebase
const app = initializeApp(firebaseConfig);

// Exportar o banco de dados para ser usado no App.tsx
export const db = getFirestore(app);