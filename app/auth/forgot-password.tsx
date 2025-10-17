import { useAuth } from "@/services/contexts/AuthContext";
import { useTheme, type Theme as AppTheme } from "@/services/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ImageStyle,
  type TextStyle,
  type ViewStyle
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const DESIGN_WIDTH = 375; 
const SCALE = SCREEN_WIDTH / DESIGN_WIDTH;
const fp = (size: number) => Math.round(size * SCALE);
const HORIZONTAL_MARGIN = fp(20);

export default function ForgotPassword() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isLoading, clearError } = useAuth();
  const [resetEmail, setResetEmail] = useState("");

  const styles = getStyles(theme);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async () => {
    clearError();

    if (!resetEmail) {
      Alert.alert("Email manquant", "Entre l'adresse email associée à ton compte pour recevoir le lien de réinitialisation.");
      return;
    }

    if (!validateEmail(resetEmail)) {
      Alert.alert("Email invalide", "Vérifie l'adresse email et réessaie (ex: toi@exemple.com).");
      return;
    }

    try {
      Alert.alert(
        "Email envoyé",
        "Un email de réinitialisation a été envoyé à ton adresse. Vérifie ta boîte de réception (et les spams).",
        [
          {
            text: "OK",
            onPress: () => router.push("/auth/login"),
          },
        ]
      );
    } catch {
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style={theme.isDark ? "light" : "dark"} backgroundColor={theme.background} translucent={false} />
      
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.logoContainer}>
            <ExpoImage 
              source={require("@/assets/logo.png")} 
              style={styles.logo}
              contentFit="contain"
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Mot de passe oublié</Text>
            <Text style={styles.subtitle}>
            Veuillez entrer votre mail pour réinitialiser 
            votre mot de passe.
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Adresse email"
              placeholderTextColor={theme.isDark ? '#FFFFFF' : '#6B6A7F'}
              value={resetEmail}
              onChangeText={setResetEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.buttonDisabled]}
            onPress={handleForgotPassword}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.primaryText} />
            ) : (
              <Text style={styles.loginButtonText}>Continuer</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: theme.isDark ? '#FFFFFF' : '#6B6A7F' }]}>Tu te souviens de ton mot de passe ? </Text>
            <TouchableOpacity 
              onPress={() => router.push("/auth/login")}
              disabled={isLoading}
            >
              <Text style={[styles.signupLink, { textDecorationLine: "underline" }]}>Connecte-toi</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// Define the styles type
type Styles = {
  container: ViewStyle;
  scrollView: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  logoContainer: ViewStyle;
  logo: ImageStyle;
  titleContainer: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle & { color: string };
  inputContainer: ViewStyle;
  input: ViewStyle & { color: string; fontFamily: string; fontSize: number };
  loginButton: ViewStyle;
  buttonDisabled: ViewStyle;
  loginButtonText: TextStyle;
  signupContainer: ViewStyle;
  signupText: TextStyle;
  signupLink: TextStyle;
  keyboardAvoidingView: ViewStyle;
};

const getStyles = (theme: AppTheme): Record<keyof Styles, any> => {
  const inputBase = {
    width: '100%' as const,
    height: Math.max(50, SCREEN_HEIGHT * 0.06),
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'KumbhSans_400Regular',
    color: theme.text,
    borderWidth: 0,
  };

  const styles: Record<keyof Styles, any> = {
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === 'ios' ? fp(20) : fp(10),
    },
    scrollView: {
      flexGrow: 1,
      paddingTop: Platform.OS === 'ios' ? fp(100) : fp(80),
      paddingHorizontal: HORIZONTAL_MARGIN,
      paddingBottom: 100,
    },
    header: {
      position: 'absolute',
      top: Platform.OS === 'ios' ? fp(50) : fp(30),
      left: fp(12),
      zIndex: 10,
    },
    backButton: {
      padding: 12,
      margin: -8,
    },
    logoContainer: {
      width: '100%',
      alignItems: 'center',
      marginTop: fp(40),
      marginBottom: fp(10),
    },
    logo: {
      width: fp(110),
      height: fp(104),
      resizeMode: 'contain' as const,
    },
    titleContainer: {
      width: '90%',
      maxWidth: fp(296),
      alignSelf: 'center',
      marginTop: fp(5),
      marginBottom: fp(30),
      alignItems: 'center',
    },
    title: {
      fontFamily: 'KumbhSans_800ExtraBold',
      fontSize: fp(28),
      fontWeight: '800',
      lineHeight: fp(32),
      textAlign: 'center',
      color: theme.text,
      marginTop: 0,
      marginBottom: 0,
      width: '100%',
    },
    subtitle: {
      fontFamily: 'KumbhSans_400Regular',
      fontSize: fp(14),
      lineHeight: fp(18),
      color: '#6B6A7F',
      textAlign: 'center',
      width: '100%',
      paddingHorizontal: fp(10),
      marginTop: fp(8),
      marginBottom: 0,
    },
    inputContainer: {
      marginBottom: fp(20),
      width: '100%',
      alignSelf: 'center',
    },
    input: {
      ...inputBase,
      height: fp(48),
      fontSize: fp(16),
      paddingHorizontal: fp(16),
      width: '100%',
      backgroundColor: theme.isDark ? '#26253B' : '#FFFFFF',
      borderRadius: fp(12),
    } as ViewStyle & { color: string; fontFamily: string; fontSize: number },
    loginButton: {
      backgroundColor: theme.isDark ? '#FFFFFF' : '#18172A',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: fp(12),
      marginTop: fp(40),
      marginBottom: fp(20),
      width: '100%',
      height: fp(56),
      alignSelf: 'center',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    loginButtonText: {
      fontSize: fp(16),
      fontFamily: 'KumbhSans_700Bold',
      color: theme.isDark ? '#18172A' : '#FFFFFF',
      textAlign: 'center',
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: fp(24),
    },
    signupText: {
      fontSize: fp(14),
      fontFamily: 'KumbhSans_400Regular',
    },
    signupLink: {
      fontSize: fp(14),
      fontFamily: 'KumbhSans_600SemiBold',
      color: theme.primary,
      marginLeft: fp(4),
    },
    keyboardAvoidingView: {
      flex: 1,
    },
  };
  
  return StyleSheet.create(styles);
};