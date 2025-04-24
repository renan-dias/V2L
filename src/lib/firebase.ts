import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { toast } from 'sonner';

// Check if Firebase configuration is available
const hasValidFirebaseConfig = 
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID &&
  import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;

// Função para verificar se temos todas as configurações necessárias
const validateFirebaseConfig = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY', 
    'VITE_FIREBASE_AUTH_DOMAIN', 
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName]);
  
  if (missingVars.length > 0) {
    console.error(`Configuração do Firebase incompleta. Variáveis ausentes: ${missingVars.join(', ')}`);
    return false;
  }
  
  return true;
};

// Use real config if available, otherwise use demo values
const firebaseConfig = hasValidFirebaseConfig ? {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} : {
  // Demo values for development only - these aren't real Firebase credentials
  apiKey: 'demo-api-key',
  authDomain: 'demo-project.firebaseapp.com',
  projectId: 'demo-project',
  storageBucket: 'demo-project.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abc123def456',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Verificar se o acesso ao Storage está configurado corretamente
export const isStorageConfigured = validateFirebaseConfig() && hasValidFirebaseConfig;

// Show warning toast if using demo config
if (!hasValidFirebaseConfig) {
  // Display a warning once the app has loaded
  setTimeout(() => {
    toast.warning(
      "Executando em modo de demonstração - Recursos do Firebase serão limitados",
      {
        description: "Recursos como upload de vídeo não funcionarão. Adicione suas credenciais do Firebase ao arquivo .env para habilitar funcionalidade completa.",
        duration: 10000,
      }
    );
    
    console.warn(
      "Firebase está rodando em modo de demonstração. Algumas funcionalidades como upload de arquivos não funcionarão. Para habilitar todas as funcionalidades, adicione suas credenciais do Firebase ao arquivo .env."
    );
    
    // Instruções para configurar o Firebase
    console.info(`
    Para configurar o Firebase, crie um arquivo .env na raiz do projeto com as seguintes variáveis:
    
    VITE_FIREBASE_API_KEY=sua_api_key
    VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=seu_projeto
    VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
    VITE_FIREBASE_APP_ID=seu_app_id
    `);
  }, 1000);
}

export default app;
