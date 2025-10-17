import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { useColorScheme, AppState } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'auto';

// Définition des thèmes
export interface Theme {
  background: string;
  surface: string;
  surfaceVariant: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  primaryText: string;
  border: string;
  card: string;
  error: string;
  success: string;
  isDark: boolean;
}

// Mémorisation des thèmes pour éviter les recréations inutiles
const THEMES = {
  light: {
    background: '#F5F6F7',
    surface: '#FFFFFF',
    surfaceVariant: '#E8E8E8',
    text: '#18172A',
    textSecondary: '#6B6A7F',
    textTertiary: '#9E9EB0',
    primary: '#18172A',
    primaryText: '#FFFFFF',
    border: '#E0E0E0',
    card: '#FFFFFF',
    error: '#FF3B30',
    success: '#34C759',
    isDark: false,
  } as const,
  dark: {
    background: '#18172A',
    surface: '#1F1E33',
    surfaceVariant: '#2A2940',
    text: '#FFFFFF',
    textSecondary: '#6B6A7F',
    textTertiary: '#9E9EB0',
    primary: '#FFFFFF',
    primaryText: '#18172A',
    border: '#2A2940',
    card: '#1F1E33',
    error: '#FF453A',
    success: '#32D74B',
    isDark: true,
  } as const,
} as const;

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Types de thèmes
type ThemeKey = keyof typeof THEMES;
const getTheme = (key: ThemeKey): Theme => THEMES[key];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
  
  // Calcul du thème effectif avec useMemo pour éviter les recalculs inutiles
  const effectiveTheme = useMemo(() => {
    return themeMode === 'auto' 
      ? systemColorScheme === 'light' ? 'light' : 'dark'
      : themeMode;
  }, [themeMode, systemColorScheme]);

  // Mémorisation du thème actuel
  const theme = useMemo(() => 
    getTheme(effectiveTheme as ThemeKey), 
  [effectiveTheme]);

  // Fonction pour charger les préférences de thème
  const loadThemePreference = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      const savedMode = await AsyncStorage.getItem('theme_mode') as ThemeMode | null;
      
      if (userData && savedMode && ['light', 'dark', 'auto'].includes(savedMode)) {
        setThemeModeState(savedMode);
      } else if (!userData) {
        setThemeModeState('auto');
        await AsyncStorage.removeItem('theme_mode');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du thème:', error);
    }
  }, []);

  // Charger la préférence de thème au démarrage et gérer le retour au premier plan
  useEffect(() => {
    // Chargement initial
    loadThemePreference();

    // Gestion du retour au premier plan
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        loadThemePreference();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [loadThemePreference]);

  // Mise à jour asynchrone du mode de thème
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('theme_mode', mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du thème:', error);
    }
  }, []);

  // Basculement du thème
  const toggleTheme = useCallback(() => {
    const newMode = effectiveTheme === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
  }, [effectiveTheme, setThemeMode]);

  // Mémorisation de la valeur du contexte
  const contextValue = useMemo(() => ({
    theme,
    themeMode,
    setThemeMode,
    toggleTheme,
  }), [theme, themeMode, setThemeMode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
