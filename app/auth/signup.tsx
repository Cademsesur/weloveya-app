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

export default function Signup() {
  const router = useRouter();
  const { theme } = useTheme();
  const { register, isLoading, error, clearError } = useAuth();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const styles = getStyles(theme);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!firstName || !lastName) {
        Alert.alert("Informations manquantes", "Merci de renseigner ton prénom et ton nom.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!email) {
        Alert.alert("Email manquant", "Merci de renseigner ton adresse email.");
        return;
      }
      if (!validateEmail(email)) {
        Alert.alert("Email invalide", "Vérifie ton adresse email et réessaie (ex: toi@exemple.com).");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!password || !confirmPassword) {
        Alert.alert("Mot de passe manquant", "Merci de renseigner ton mot de passe.");
        return;
      }
      if (password.length < 8) {
        Alert.alert("Mot de passe trop court", "Le mot de passe doit contenir au moins 8 caractères.");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Mots de passe différents", "Les mots de passe ne correspondent pas.");
        return;
      }
      handleSignup();
    }
  };

  const handleSignup = async () => {
    clearError();

    try {
      await register({
        email,
        password,
        password_confirmation: confirmPassword,
        firstname: firstName || undefined,
        lastname: lastName || undefined,
      });
      router.replace("/(tabs)/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      
      if (errorMessage.includes('SQLSTATE') || errorMessage.includes('does not exist')) {
        Alert.alert(
          "Service temporairement indisponible", 
          "Le serveur rencontre un problème technique. Veuillez réessayer plus tard ou contacter le support."
        );
      } else if (errorMessage.includes('already') || errorMessage.includes('exists')) {
        Alert.alert(
          "Compte déjà existant", 
          "Un compte avec cet email existe déjà. Essaie de te connecter ou utilise un autre email."
        );
      } else {
        Alert.alert(
          "Impossible de créer le compte", 
          error || "Nous n'avons pas pu créer ton compte pour le moment. Vérifie ta connexion et réessaie."
        );
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
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
          {/* Indicateur d'étape */}
          <View style={styles.stepIndicator}>
            <View style={[styles.stepBlock, step >= 1 && styles.stepBlockActive]} />
            <View style={[styles.stepBlock, step >= 2 && styles.stepBlockActive]} />
            <View style={[styles.stepBlock, step >= 3 && styles.stepBlockActive]} />
          </View>

          <View style={styles.header}>
            <TouchableOpacity 
              onPress={handleBack}
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
            <Text style={styles.title}>Inscription</Text>
            <Text style={styles.subtitle}>
              Créez votre compte pour accéder à
              votre espace revendeur.
            </Text>
          </View>

          {/* Étape 1 : Nom et Prénom */}
          {step === 1 && (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Prénom"
                  placeholderTextColor={theme.isDark ? '#FFFFFF' : '#6B6A7F'}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nom"
                  placeholderTextColor={theme.isDark ? '#FFFFFF' : '#6B6A7F'}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity 
                style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                onPress={handleNextStep}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>Continuer</Text>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={[styles.signupText, { color: theme.isDark ? '#FFFFFF' : '#6B6A7F' }]}>Vous avez déjà un compte ? </Text>
                <TouchableOpacity 
                  onPress={() => router.push("/auth/login")}
                  disabled={isLoading}
                >
                  <Text style={[styles.signupLink, { textDecorationLine: "underline" }]}>Connectez-vous</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Étape 2 : Email */}
          {step === 2 && (
            <>
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

              <TouchableOpacity 
                style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                onPress={handleNextStep}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>Continuer</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Étape 3 : Mot de passe */}
          {step === 3 && (
            <>
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
                      name={showPassword ? "eye-off" : "eye"} 
                      size={24} 
                      color={theme.isDark ? '#FFFFFF' : '#6B6A7F'} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirmer le mot de passe"
                    placeholderTextColor={theme.isDark ? '#FFFFFF' : '#6B6A7F'}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                    disabled={isLoading}
                  >
                    <Ionicons 
                      name={showConfirmPassword ? "eye-off" : "eye"} 
                      size={24} 
                      color={theme.isDark ? '#FFFFFF' : '#6B6A7F'} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.passwordHint}>Minimum 8 caractères</Text>

              <TouchableOpacity 
                style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                onPress={handleNextStep}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={theme.primaryText} />
                ) : (
                  <Text style={styles.loginButtonText}>Créer mon compte</Text>
                )}
              </TouchableOpacity>
            </>
          )}
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
  passwordContainer: ViewStyle;
  passwordInput: ViewStyle & { color: string; fontFamily: string; fontSize: number };
  eyeIcon: ViewStyle;
  loginButton: ViewStyle;
  buttonDisabled: ViewStyle;
  loginButtonText: TextStyle;
  signupContainer: ViewStyle;
  signupText: TextStyle;
  signupLink: TextStyle;
  keyboardAvoidingView: ViewStyle;
  stepIndicator: ViewStyle;
  stepBlock: ViewStyle;
  stepBlockActive: ViewStyle;
  passwordHint: TextStyle;
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
    stepIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: fp(30),
      marginTop: fp(20),
      gap: fp(8),
      paddingHorizontal: 0,
    },
    stepBlock: {
      flex: 1,
      height: fp(4),
      borderRadius: fp(2),
      backgroundColor: theme.isDark ? '#26253B' : '#BCBBC2',
    },
    stepBlockActive: {
      backgroundColor: theme.isDark ? '#FFFFFF' : '#18172A',
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
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.isDark ? '#26253B' : '#FFFFFF',
      borderRadius: fp(12),
      height: fp(48),
      width: '100%',
      paddingRight: fp(10),
    },
    passwordInput: {
      ...inputBase,
      height: fp(48),
      fontSize: fp(16),
      paddingHorizontal: fp(16),
      borderWidth: 0,
      flex: 1,
      width: '100%',
      backgroundColor: 'transparent',
    } as ViewStyle & { color: string; fontFamily: string; fontSize: number },
    eyeIcon: {
      padding: fp(10),
    },
    passwordHint: {
      fontSize: fp(14),
      fontFamily: 'KumbhSans_400Regular',
      color: '#6B6A7F',
      marginTop: fp(-12),
      marginBottom: fp(20),
    },
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