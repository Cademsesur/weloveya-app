import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from 'expo-video';
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from 'expo-font';
import { KumbhSans_700Bold, KumbhSans_800ExtraBold } from '@expo-google-fonts/kumbh-sans';
import React, { useState } from "react";
import { useTheme } from "@/services/contexts/ThemeContext";
import { useAuth } from "@/services/contexts/AuthContext";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Constantes responsive
const RESPONSIVE = {
  headerTop: Platform.OS === "ios" ? SCREEN_HEIGHT * 0.075 : SCREEN_HEIGHT * 0.055,
  horizontalPadding: SCREEN_WIDTH * 0.05,
  iconSize: Math.min(Math.max(SCREEN_WIDTH * 0.07, 24), 32),
  logoSize: Math.min(Math.max(SCREEN_WIDTH * 0.1, 35), 50),
  skipFontSize: Math.min(Math.max(SCREEN_WIDTH * 0.045, 16), 20),
  titleFontSize: Math.min(Math.max(SCREEN_WIDTH * 0.09, 30), 42),
  titleLineHeight: Math.min(Math.max(SCREEN_WIDTH * 0.1, 34), 48),
  buttonHeight: Math.max(SCREEN_HEIGHT * 0.07, 50),
  emailFontSize: Math.min(Math.max(SCREEN_WIDTH * 0.04, 14), 18),
  socialBtnWidth: SCREEN_WIDTH * 0.26,
  socialBtnHeight: Math.max(SCREEN_HEIGHT * 0.06, 45),
  socialIconSize: Math.min(Math.max(SCREEN_WIDTH * 0.06, 22), 28),
  termsFontSize: Math.min(Math.max(SCREEN_WIDTH * 0.03, 11), 14),
  termsLineHeight: Math.min(Math.max(SCREEN_WIDTH * 0.04, 14), 18),
};

export default function Onboarding() {
  const router = useRouter();
  const { theme } = useTheme();
  const { markOnboardingComplete } = useAuth();
  const [isMuted, setIsMuted] = useState(true);
  
  // Chargement des polices
  const [fontsLoaded] = useFonts({
    'KumbhSans_700Bold': KumbhSans_700Bold,
    'KumbhSans_800ExtraBold': KumbhSans_800ExtraBold,
  });
  
  // Initialisation du lecteur vidéo
  const player = useVideoPlayer(require("../../assets/images/video.mp4"), (player) => {
    player.loop = true;
    player.muted = isMuted;
    player.play();
  });

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (player) {
      player.muted = newMutedState;
    }
  };

  const handleContinueWithEmail = async () => {
    await markOnboardingComplete();
    router.push("/auth/login");
  };

  const styles = getStyles(theme);

  // Afficher un indicateur de chargement tant que les polices ne sont pas chargées
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent={true} backgroundColor="transparent" />
      
      {/* Vidéo de fond moitié haute */}
      <View style={styles.videoContainer}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
          allowsFullscreen={false}
        />
      </View>

      {/* Dégradé fixe */}
      <LinearGradient
        colors={theme.isDark ? ["transparent", "rgba(24, 23, 42, 0.3)", "rgba(24, 23, 42, 0.7)", "#18172A", "#18172A"] : ["transparent", "rgba(245, 246, 247, 0.2)", "rgba(245, 246, 247, 0.6)", "#F5F6F7", "#F5F6F7"]}
        locations={[0, 0.35, 0.55, 0.75, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={toggleMute}>
          {isMuted ? (
            <MaterialCommunityIcons 
              name="volume-mute" 
              size={RESPONSIVE.iconSize} 
              color="white"
            />
          ) : (
            <Ionicons 
              name="volume-high" 
              size={RESPONSIVE.iconSize} 
              color="white"
            />
          )}
        </TouchableOpacity>

        <View style={styles.headerLogo}>
          <Image
            source={require("../../assets/images/logo.png")}
            style={{ 
              width: RESPONSIVE.logoSize, 
              height: RESPONSIVE.logoSize, 
              resizeMode: "contain" 
            }}
          />
        </View>

        <View style={styles.headerSkip} />
      </View>

      {/* Contenu principal */}
      <View style={styles.content}>
        <Text style={styles.title}>
          EYA ! LA VIBE,{"\n"}C&apos;EST MAINTENANT
        </Text>

        {/* Bouton email */}
        <TouchableOpacity 
          activeOpacity={0.8}
          style={styles.emailButton}
          onPress={handleContinueWithEmail}
        >
          <Text style={styles.emailText}>CONTINUER AVEC MON EMAIL</Text>
        </TouchableOpacity>
        {/* Boutons sociaux */}
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialBtn}>
            <AntDesign name="apple" size={RESPONSIVE.socialIconSize} color={theme.isDark ? "white" : "#18172A"} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <FontAwesome name="facebook-square" size={RESPONSIVE.socialIconSize} color={theme.isDark ? "white" : "#18172A"} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <AntDesign name="google" size={RESPONSIVE.socialIconSize} color={theme.isDark ? "white" : "#18172A"} />
          </TouchableOpacity>
        </View>

        {/* Texte légal structuré */}
        <Text style={styles.terms}>
          En continuant, tu acceptes les{" "}
          <Text style={styles.link}>Conditions Générales d&apos;Utilisation</Text> de WeLoveEya, ainsi que la{" "}
          <Text style={styles.link}>Politique Relative aux Données Personnelles</Text>.
        </Text>
      </View>

    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
    zIndex: 0,
    position: 'absolute',
    top: 0,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.7,
    zIndex: 1,
  },
  header: {
    position: "absolute",
    top: RESPONSIVE.headerTop,
    width: SCREEN_WIDTH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: RESPONSIVE.horizontalPadding,
    zIndex: 2,
  },
  headerIcon: {
    flex: 1,
    alignItems: "flex-start",
  },
  headerLogo: {
    flex: 1,
    alignItems: "center",
  },
  headerSkip: {
    flex: 1,
    alignItems: "flex-end",
  },
  skipText: {
    color: theme.text,
    fontSize: RESPONSIVE.skipFontSize,
    fontWeight: "600",
    fontFamily: "KumbhSans_700Bold",
  },
  content: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.60,
    left: RESPONSIVE.horizontalPadding,
    width: SCREEN_WIDTH - (RESPONSIVE.horizontalPadding * 2),
    alignItems: "center",
    gap: SCREEN_HEIGHT * 0.03,
    zIndex: 2,
  },
  title: {
    color: theme.text,
    fontFamily: "KumbhSans_800ExtraBold",
    fontSize: RESPONSIVE.titleFontSize,
    lineHeight: RESPONSIVE.titleLineHeight,
    textAlign: "center",
  },
  emailButton: {
    width: "100%",
    height: RESPONSIVE.buttonHeight,
    backgroundColor: theme.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emailText: {
    color: theme.primaryText,
    fontWeight: "700",
    fontSize: RESPONSIVE.emailFontSize,
    fontFamily: "KumbhSans_700Bold",
    textAlign: "center",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: SCREEN_HEIGHT * 0.015,
    gap: SCREEN_WIDTH * 0.03,
  },
  socialBtn: {
    flex: 1,
    height: RESPONSIVE.socialBtnHeight,
    backgroundColor: theme.isDark ? theme.surface : "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0,
    borderColor: "transparent",
    ...(!theme.isDark && {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  terms: {
    marginTop: SCREEN_HEIGHT * 0.02,
    width: "100%",
    color: "#6B6A7F",
    fontSize: RESPONSIVE.termsFontSize,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: RESPONSIVE.termsLineHeight,
    paddingHorizontal: SCREEN_WIDTH * 0.02,
  },
  link: {
    textDecorationLine: "underline",
    color: "#6B6A7F",
  },
});