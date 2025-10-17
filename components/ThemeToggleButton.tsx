import { useTheme } from "@/services/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface ThemeToggleButtonProps {
  size?: number;
  style?: any;
}

/**
 * Composant réutilisable pour toggle entre light et dark mode
 * 
 * @example
 * ```tsx
 * <ThemeToggleButton size={24} />
 * ```
 */
export default function ThemeToggleButton({ size = 20, style }: ThemeToggleButtonProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      {theme.isDark ? (
        <Sun size={size} color={theme.primary} />
      ) : (
        <Moon size={size} color={theme.text} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
