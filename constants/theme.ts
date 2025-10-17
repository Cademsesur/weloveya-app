/**
 * Constantes de thème pour l'application
 * Pour utiliser le système de thème dynamique, importez useTheme depuis ThemeContext
 * @see /services/contexts/ThemeContext.tsx
 */

// Couleurs du thème light
export const lightColors = {
	background: '#FFFFFF',
	surface: '#F5F5F5',
	surfaceVariant: '#E8E8E8',
	text: '#18172A',
	textSecondary: '#6B6A7F',
	textTertiary: '#9E9EB0',
	primary: '#FCC017',
	primaryText: '#18172A',
	border: '#E0E0E0',
	card: '#FFFFFF',
	error: '#FF3B30',
	success: '#34C759',
};

// Couleurs du thème dark
export const darkColors = {
	background: '#18172A',
	surface: '#1F1E33',
	surfaceVariant: '#2A2940',
	text: '#FFFFFF',
	textSecondary: '#6B6A7F',
	textTertiary: '#9E9EB0',
	primary: '#FCC017',
	primaryText: '#18172A',
	border: '#2A2940',
	card: '#1F1E33',
	error: '#FF453A',
	success: '#32D74B',
};

// Anciennes couleurs (deprecated - utilisez useTheme à la place)
export const colors = {
	primary: '#FCC017',
	background: '#18172A',
	text: '#FFFFFF',
	border: '#2A2940',
};

export const spacing = {
	small: 8,
	medium: 16,
	large: 24,
	xlarge: 32,
};
