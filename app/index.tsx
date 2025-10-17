import { useAuth } from "@/services/contexts/AuthContext";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";

export default function Index() {
  const { isLoading, isAuthenticated, isFirstVisit } = useAuth();

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // Si l'utilisateur est connecté, rediriger vers le dashboard
  if (isAuthenticated) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  // Si c'est la première visite, afficher l'onboarding
  if (isFirstVisit) {
    return <Redirect href="/(tabs)/onboarding" />;
  }

  // Sinon, rediriger vers la page de connexion
  return <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#18172A",
  },
});
