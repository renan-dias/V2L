import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { toast } from 'sonner';

// Check if Firebase configuration is available
const hasValidFirebaseConfig = 
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID;

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

// Show warning toast if using demo config
if (!hasValidFirebaseConfig) {
  // Display a warning once the app has loaded
  setTimeout(() => {
    toast.warning(
      "Running in demo mode - Firebase features will be limited",
      {
        description: "Add your Firebase credentials to .env to enable full functionality",
        duration: 8000,
      }
    );
    
    console.warn(
      "Firebase is running in demo mode. Add your Firebase credentials to .env file to enable full functionality."
    );
  }, 1000);
}

export default app;
