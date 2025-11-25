import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

// --- ATENÇÃO ---
// Substitua os valores abaixo pelas credenciais do seu projeto Firebase.
// Você pode encontrar esses valores no Console do Firebase, nas configurações do seu projeto web.
// https://console.firebase.google.com/
const firebaseConfig = {
  apiKey: "COLOQUE_SUA_API_KEY_AQUI",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

// --- INICIALIZAÇÃO CONDICIONAL ---
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let isFirebaseConfigured = false;

// Validação para garantir que as credenciais foram alteradas
if (firebaseConfig.apiKey.startsWith("COLOQUE_") || firebaseConfig.apiKey.startsWith("YOUR_")) {
  console.warn(
    "AVISO: Credenciais do Firebase não configuradas em /lib/firebase.ts. A aplicação será executada em MODO DEMO. Funcionalidades de salvamento na nuvem e tempo real estarão desabilitadas."
  );
} else {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseConfigured = true;
  } catch (error) {
    console.error("ERRO: Falha ao inicializar o Firebase. Verifique se as suas credenciais estão corretas.", error);
  }
}

// Exporta os serviços (ou null se não configurado) e o flag de status
export { app, db, auth, isFirebaseConfigured };
