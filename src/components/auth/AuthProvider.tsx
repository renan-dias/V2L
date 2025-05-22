
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, OAuthCredential } from 'firebase/auth'; // Added OAuthCredential
import { signInWithGoogle, signOut, onAuthStateChange } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  youtubeAccessToken?: string | null; // Added
}

// Create context with a default value matching the interface
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  youtubeAccessToken: null // Added
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [youtubeAccessToken, setYoutubeAccessToken] = useState<string | null>(null); // Added

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
      // If user signs out or auth state changes to no user, clear token.
      // If user signs in, handleSignIn will set the token.
      if (!user) {
        setYoutubeAccessToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      // signInWithGoogle from authService now returns UserCredential
      const userCredential = await signInWithGoogle();
      // The user object itself will be set by onAuthStateChange,
      // but we need the credential here for the access token.
      if (userCredential && userCredential.credential) {
        // Explicitly cast to OAuthCredential to access accessToken
        const credential = userCredential.credential as OAuthCredential;
        if (credential && credential.accessToken) {
          setYoutubeAccessToken(credential.accessToken);
        } else {
          // Handle case where accessToken might not be present
          console.warn('YouTube OAuth Access Token not found in credential.');
          setYoutubeAccessToken(null);
        }
      }
    } catch (error) {
      console.error('Error signing in with Google for YouTube scope:', error);
      setYoutubeAccessToken(null);
      // throw error; // Decide if re-throwing is necessary based on UI handling
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(); // signOut from authService
      setYoutubeAccessToken(null); // Clear the YouTube access token on sign out
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn: handleSignIn,
    signOut: handleSignOut,
    youtubeAccessToken // Added
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
