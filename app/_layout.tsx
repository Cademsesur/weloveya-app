import MobileMenu from "@/components/MobileMenu";
import { AuthProvider } from "@/services/contexts/AuthContext";
import { ThemeProvider, useTheme } from "@/services/contexts/ThemeContext";
import { KkiapayProvider } from '@kkiapay-org/react-native-sdk';
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { StatusBar, StyleSheet, View, Image } from "react-native";
import { FontLoader } from "@/components/FontLoader";

// Empêcher le splash screen de se cacher automatiquement
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Afficher le splash personnalisé pendant 4 secondes
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Marquer l'app comme prête
        setAppIsReady(true);
        
        // Cacher le splash screen
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  // Afficher le splash screen personnalisé pendant le chargement
  if (!appIsReady) {
    return (
      <View style={styles.splashContainer}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor="#FFFFFF" 
          translucent={false} 
        />
        <Image
          source={require("../assets/SplashScreen.png")}
          style={styles.splashImage}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <KkiapayProvider>
      <ThemeProvider>
        <AuthProvider>
          <FontLoader>
            <LayoutContent />
          </FontLoader>
        </AuthProvider>
      </ThemeProvider>
    </KkiapayProvider>
  );
}

function LayoutContent() {
  const [activeTab, setActiveTab] = useState("Accueil");
  const pathname = usePathname();
  const { theme } = useTheme();
  const [isNavigationReady, setIsNavigationReady] = useState(false);

  useEffect(() => {
    // Attendre que le pathname soit défini avant d'afficher le menu
    if (pathname) {
      setIsNavigationReady(true);
    }
  }, [pathname]);

  const shouldShowMenu = isNavigationReady && 
    pathname && 
    !pathname.includes("onboarding") && 
    !pathname.includes("auth") &&
     pathname !== "/";

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
    
     <StatusBar 
       barStyle={theme.isDark ? "light-content" : "dark-content"} 
       backgroundColor={theme.background} 
       translucent={false} 
     />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      />

      {shouldShowMenu && (
        <MobileMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
});
