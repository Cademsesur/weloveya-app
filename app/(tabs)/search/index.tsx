import { useTheme } from '@/services/contexts/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Search() {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <Text style={styles.subtitle}>Recherche vide — essaye une requête.</Text>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: theme.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: theme.textSecondary,
    fontSize: 14,
  },
});
