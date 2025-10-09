// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import ApiService, { User, RegisterData, LoginData } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await ApiService.getToken();
      if (token) {
        // Ici tu pourrais appeler un endpoint pour récupérer les infos de l'utilisateur
        // Pour l'instant on considère qu'il est authentifié si le token existe
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginData) => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await ApiService.login(data);
      setUser(response.data.user);
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
      await ApiService.logout();
      setUser(null);
      router.replace('/(tabs)/onboarding');
    } catch (err) {
      console.error('Logout error:', err);
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
        login,
        register,
        logout,
        error,
        clearError,
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