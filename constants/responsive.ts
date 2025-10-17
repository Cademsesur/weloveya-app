import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Basé sur la largeur de l'écran de référence (iPhone 12/13/14)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Fonction pour le scaling horizontal (basé sur la largeur)
export const scaleWidth = (size: number) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Fonction pour le scaling vertical (basé sur la hauteur)
export const scaleHeight = (size: number) => {
  const scale = SCREEN_HEIGHT / BASE_HEIGHT;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Fonction pour la taille de police responsive
export const scaleFont = (size: number) => {
  const scale = Math.min(SCREEN_WIDTH / BASE_WIDTH, 1.2); // Limiter le facteur d'échelle max à 1.2
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Tailles de base pour les marges et espacements
export const spacing = {
  xs: scaleWidth(4),
  sm: scaleWidth(8),
  md: scaleWidth(12),
  lg: scaleWidth(16),
  xl: scaleWidth(24),
  xxl: scaleWidth(32),
};

// Tailles de police de base
export const fontSizes = {
  xs: scaleFont(12),
  sm: scaleFont(14),
  base: scaleFont(16),
  lg: scaleFont(18),
  xl: scaleFont(20),
  '2xl': scaleFont(24),
  '3xl': scaleFont(30),
};

// Hauteurs de ligne de base
export const lineHeights = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.8,
};

// Fonction pour obtenir les styles de police responsive
export const getTextStyles = (size: keyof typeof fontSizes = 'base', lineHeight: keyof typeof lineHeights = 'normal') => ({
  fontSize: fontSizes[size],
  lineHeight: fontSizes[size] * lineHeights[lineHeight],
  fontFamily: 'KumbhSans_500Medium',
  textAlign: 'center' as const,
  letterSpacing: 0,
});

// Fonction pour les styles de placeholder
export const placeholderTextStyles = {
  ...getTextStyles('base'),
  opacity: 0.7,
};

// Détection de la plateforme
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Hauteur de la barre de statut
export const statusBarHeight = isIOS ? 44 : 24;

// Hauteur de la barre de navigation (pour les iPhones avec encoche)
export const bottomNavBarHeight = isIOS ? 34 : 0;

// Dimensions de l'écran
export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  paddingHorizontal: scaleWidth(20),
};

// Fonction pour le padding horizontal responsive
export const horizontalPadding = {
  paddingHorizontal: screenDimensions.paddingHorizontal,
};

// Fonction pour les coins arrondis responsive
export const borderRadius = {
  sm: scaleWidth(4),
  md: scaleWidth(8),
  lg: scaleWidth(12),
  xl: scaleWidth(16),
  full: 9999,
};

export default {
  scaleWidth,
  scaleHeight,
  scaleFont,
  spacing,
  fontSizes,
  lineHeights,
  getTextStyles,
  placeholderTextStyles,
  isIOS,
  isAndroid,
  statusBarHeight,
  bottomNavBarHeight,
  screenDimensions,
  horizontalPadding,
  borderRadius,
};
