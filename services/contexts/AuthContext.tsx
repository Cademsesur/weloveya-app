// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService, { User, RegisterData, LoginData } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isFirstVisit: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  markOnboardingComplete: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Vérifier si c'est la première visite
      const hasVisited = await AsyncStorage.getItem('has_visited');
      setIsFirstVisit(hasVisited !== 'true');

      // Vérifier si l'utilisateur est connecté
      const token = await ApiService.getToken();
      
      if (token) {
        // Récupérer les données utilisateur sauvegardées
        const savedUser = await AsyncStorage.getItem('user_data');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error checking auth status:', err);
      setIsLoading(false);
    }
  };

  const markOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem('has_visited', 'true');
      setIsFirstVisit(false);
    } catch (err) {
      console.error('Error marking onboarding complete:', err);
    }
  };

  const login = async (data: LoginData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await ApiService.login(data);
      setUser(response.data.user);
      
      // Sauvegarder les données utilisateur
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
      await markOnboardingComplete();
      
      router.replace('/(tabs)/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await ApiService.register(data);
      setUser(response.data.user);
      
      // Sauvegarder les données utilisateur
      await AsyncStorage.setItem('user_data', JSON.stringify(response.data.user));
      await markOnboardingComplete();
      
      router.replace('/(tabs)/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur d'inscription";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // Rediriger immédiatement vers l'onboarding
      router.replace('/(tabs)/onboarding');
      
      // Nettoyer les données en arrière-plan
      try {
        await ApiService.logout();
      } catch (e) {
        console.warn('Error during API logout (non-critical):', e);
      }
      
      setUser(null);
      // Supprimer toutes les données utilisateur en une seule opération
      await AsyncStorage.multiRemove(['user_data', 'has_visited', 'theme_mode']);
      setIsFirstVisit(true);
    } catch (err) {
      console.error('Logout error:', err);
      throw err; // Propager l'erreur pour une gestion plus poussée si nécessaire
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isFirstVisit,
        login,
        register,
        logout,
        error,
        clearError,
        markOnboardingComplete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}