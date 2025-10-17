import { useAuth } from "@/services/contexts/AuthContext";
import { useTheme } from "@/services/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from 'expo-image';
import ExpoCheckbox from 'expo-checkbox';
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Import des utilitaires de réactivité
import { scaleHeight, scaleFont } from '@/constants/responsive';

export default function Login() {
  const router = useRouter();
  const { theme } = useTheme();
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const styles = getStyles(theme);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    clearError();

    if (!email || !password) {
      Alert.alert("Oups — champs manquants", "Merci de renseigner ton email et ton mot de passe pour continuer.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Email invalide", "Vérifie ton adresse email et réessaie (ex: toi@exemple.com).");
      return;
    }

    try {
      await login({ email, password });
      router.replace("/(tabs)/dashboard");
    } catch (err) {

      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      
      if (errorMessage.includes('SQLSTATE') || errorMessage.includes('does not exist')) {
        Alert.alert(
          "Service temporairement indisponible", 
          "Le serveur rencontre un problème technique. Veuillez réessayer plus tard ou contacter le support."
        );
      } else if (errorMessage.includes('credentials') || errorMessage.includes('Invalid')) {
        Alert.alert(
          "Identifiants incorrects", 
          "L'email ou le mot de passe est incorrect. Vérifie tes informations et réessaie."
        );
      } else {
        Alert.alert(
          "Impossible de se connecter", 
          error || "Impossible de se connecter pour le moment. Vérifie ta connexion internet et réessaie."
        );
      }
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
            onPress={() => router.push("/(tabs)/onboarding")}
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
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>
            Connectez-vous pour accéder à
            votre espace revendeur.
          </Text>
        </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Adresse email"
                placeholderTextColor={theme.isDark ? '#FFFFFF' : '#6B6A7F'}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Mot de passe"
                  placeholderTextColor={theme.isDark ? '#FFFFFF' : '#6B6A7F'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  disabled={isLoading}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off-outline" : "eye-outline"} 
                    size={24} 
                    color={theme.isDark ? '#FFFFFF' : '#6B6A7F'} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.rememberMeContainer}>
                <ExpoCheckbox
                  value={rememberMe}
                  onValueChange={setRememberMe}
                  color={rememberMe ? (theme.isDark ? '#18172A' : theme.primary) : theme.text}
                  style={styles.checkbox}
                />
                <Text style={[styles.rememberMeText, { color: theme.isDark ? '#FFFFFF' : '#6B6A7F' }]}>
                  Se souvenir de moi
                </Text>
              </View>
              
              <TouchableOpacity 
                onPress={() => router.push("/auth/forgot-password")}
                disabled={isLoading}
              >
                <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.primaryText} />
              ) : (
                <Text style={styles.loginButtonText}>Se connecter</Text>
              )}
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: theme.isDark ? '#FFFFFF' : '#6B6A7F' }]}>Vous n&#39;avez pas de compte ? </Text>
              <TouchableOpacity 
                onPress={() => router.push("/auth/signup")}
                disabled={isLoading}
              >
                <Text style={[styles.signupLink, { textDecorationLine: "underline" }]}>Inscrivez-vous</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
  );
}

const getStyles = (theme: any) => {
  const fp = scaleFont; // Alias pour scaleFont
  const HORIZONTAL_MARGIN = fp(20);
  
  return StyleSheet.create({
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
      width: 120,
      height: 120,
    },
    titleContainer: {
      marginBottom: 40,
    },
    title: {
      fontSize: fp(28),
      fontFamily: 'KumbhSans_700Bold',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
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
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: fp(14),
      fontFamily: 'KumbhSans_500Medium',
      color: theme.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.isDark ? '#26253B' : '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      fontSize: fp(16),
      fontFamily: 'KumbhSans_400Regular',
      color: theme.text,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.isDark ? '#26253B' : '#FFFFFF',
      borderRadius: 12,
    },
    passwordInput: {
      flex: 1,
      padding: 16,
      fontSize: fp(16),
      fontFamily: 'KumbhSans_400Regular',
      color: theme.text,
    },
    eyeIcon: {
      padding: 16,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginTop: scaleHeight(4),
      paddingHorizontal: 0,
    },
    forgotPasswordText: {
      fontSize: fp(14),
      fontFamily: 'KumbhSans_500Medium',
      color: theme.primary,
      textAlign: 'right',
      textDecorationLine: 'underline',
    },
    rememberMeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 0,
      paddingVertical: 4,
      flex: 1,
    },
    loginButton: {
      backgroundColor: theme.isDark ? '#FFFFFF' : '#18172A',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      marginTop: 24,
      marginBottom: 16,
      width: '100%',
      height: 56,
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
      marginTop: 16,
    },
    signupText: {
      fontSize: fp(14),
      fontFamily: 'KumbhSans_400Regular',
      color: theme.isDark ? '#E0E0E0' : '#6B6A7F',
    },
    signupLink: {
      fontSize: fp(14),
      fontFamily: 'KumbhSans_600SemiBold',
      color: theme.primary,
      marginLeft: 4,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    rememberMeText: {
      fontSize: fp(14),
      fontFamily: 'KumbhSans_400Regular',
      marginLeft: 8,
      color: theme.isDark ? '#E0E0E0' : '#6B6A7F',
    },
    checkbox: {
      width: 20,
      height: 20,
    },
  });
};