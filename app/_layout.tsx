import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet, StatusBar } from "react-native";
import { Stack, usePathname } from "expo-router";
import {
  useFonts,
  KumbhSans_700Bold,
  KumbhSans_800ExtraBold,
} from "@expo-google-fonts/kumbh-sans";
import MobileMenu from "@/components/MobileMenu";
import { AuthProvider } from "@/services/contexts/AuthContext";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    KumbhSans_700Bold,
    KumbhSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}

function LayoutContent() {
  const [activeTab, setActiveTab] = useState("Accueil");
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {/* ✅ Status bar blanche avec icônes sombres */}
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#18172A" },
        }}
      />

      {!pathname?.includes("onboarding") && (
        <MobileMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18172A",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#18172A",
  },
});
