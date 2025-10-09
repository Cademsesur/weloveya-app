import { useAuth } from "@/services/contexts/AuthContext";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Constantes responsive
const RESPONSIVE = {
  headerTop: Platform.OS === "ios" ? SCREEN_HEIGHT * 0.10 : SCREEN_HEIGHT * 0.07,
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
  const { login, register, isLoading, error, clearError } = useAuth();
  const [isMuted, setIsMuted] = useState(true);
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  type ViewMode = "login" | "signup" | "forgot";
  const [viewMode, setViewMode] = useState<ViewMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const videoRef = useRef(null);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

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
      closeSheet();
    } catch {
      Alert.alert("Impossible de se connecter", error || "Impossible de se connecter pour le moment. Vérifie tes identifiants et réessaie.");
    }
  };

  const handleSignup = async () => {
    clearError();

    if (!email || !password || !confirmPassword) {
      Alert.alert("Oups — informations manquantes", "Merci de compléter tous les champs obligatoires pour créer ton compte.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Email invalide", "Vérifie ton adresse email et réessaie (ex: toi@exemple.com).");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Mot de passe trop court", "Le mot de passe doit contenir au moins 8 caractères. Essaie d'ajouter une majuscule, un chiffre ou un symbole pour le renforcer.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Mots de passe différents", "Les mots de passe ne correspondent pas — vérifie-les et réessaie.");
      return;
    }

    try {
      await register({
        email,
        password,
        password_confirmation: confirmPassword,
        firstname: firstName || undefined,
        lastname: lastName || undefined,
      });
      closeSheet();
    } catch {
      Alert.alert("Impossible de créer le compte", error || "Nous n'avons pas pu créer ton compte pour le moment. Réessaie dans quelques instants.");
    }
  };

  const handleForgotPassword = async () => {
    clearError();

    if (!resetEmail) {
      Alert.alert("Email manquant", "Entre l'adresse email associée à ton compte pour recevoir le lien de réinitialisation.");
      return;
    }

    if (!validateEmail(resetEmail)) {
      Alert.alert("Email invalide", "Vérifie l'adresse email et réessaie (ex: toi@exemple.com). ");
      return;
    }

    try {
      Alert.alert(
        "Email envoyé",
        "Un email de réinitialisation a été envoyé à ton adresse. Vérifie ta boîte de réception (et les spams)."
      );
      setViewMode("login");
    } catch {
      Alert.alert("Impossible d'envoyer le lien", "Impossible d'envoyer le lien de réinitialisation pour le moment. Réessaie plus tard.");
    }
  };

  const openSheet = (mode: ViewMode) => {
    clearError();
    setViewMode(mode);
    setShowLoginSheet(true);
  };

  const closeSheet = () => {
    setShowLoginSheet(false);
    clearError();
    setTimeout(() => {
      setViewMode("login");
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      setConfirmPassword("");
      setResetEmail("");
    }, 300);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" translucent={false} />
      
      {/* Vidéo de fond moitié haute */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={require("../../assets/images/video.mp4")}
          style={styles.video}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay
          isMuted={isMuted}
        />
      </View>

      {/* Dégradé fixe */}
      <LinearGradient
        colors={["rgba(99, 7, 19, 0.43)", "#18172A", "#18172A"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={toggleMute}>
          <Ionicons 
            name={isMuted ? "volume-mute" : "volume-high"} 
            size={RESPONSIVE.iconSize} 
            color="white" 
          />
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
          activeOpacity={1}
          style={styles.emailButton}
          onPress={() => openSheet("login")}
          disabled={isLoading}
        >
          <Text style={styles.emailText}>CONTINUER AVEC MON EMAIL</Text>
        </TouchableOpacity>

        {/* Boutons sociaux */}
        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialBtn}>
            <AntDesign name="apple" size={RESPONSIVE.socialIconSize} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <FontAwesome name="facebook-square" size={RESPONSIVE.socialIconSize} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn}>
            <AntDesign name="google" size={RESPONSIVE.socialIconSize} color="white" />
          </TouchableOpacity>
        </View>

        {/* Texte légal structuré */}
        <Text style={styles.terms}>
          En continuant, tu acceptes les{" "}
          <Text style={styles.link}>Conditions Générales d&apos;Utilisation</Text> de WeLoveEya, ainsi que la{" "}
          <Text style={styles.link}>Politique Relative aux Données Personnelles</Text>.
        </Text>
      </View>

      {/* Bottom Sheet de connexion */}
      <Modal
        visible={showLoginSheet}
        transparent
        animationType="slide"
        onRequestClose={closeSheet}
      >
        <TouchableWithoutFeedback onPress={closeSheet}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
                keyboardVerticalOffset={RESPONSIVE.headerTop + 10}
              >
                <BlurView 
                  intensity={100}
                  tint="dark"
                  style={styles.bottomSheet}
                >
                  <View style={styles.sheetHandle} />
                  
                  <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.sheetContent}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                  >
                    {/* Vue Connexion */}
                    {viewMode === "login" && (
                      <>
                        <Text style={styles.sheetTitle}>Connexion</Text>
                        
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Email</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="ton@email.com"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isLoading}
                          />
                        </View>

                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Mot de passe</Text>
                          <View style={styles.passwordContainer}>
                            <TextInput
                              style={styles.passwordInput}
                              placeholder="••••••••"
                              placeholderTextColor="rgba(255, 255, 255, 0.5)"
                              value={password}
                              onChangeText={setPassword}
                              secureTextEntry={!showPassword}
                              editable={!isLoading}
                            />
                            <TouchableOpacity 
                              onPress={() => setShowPassword(!showPassword)}
                              style={styles.eyeIcon}
                              disabled={isLoading}
                            >
                              <Ionicons 
                                name={showPassword ? "eye-off" : "eye"} 
                                size={20} 
                                color="#FFFFFF" 
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <TouchableOpacity 
                          style={styles.forgotPassword}
                          onPress={() => setViewMode("forgot")}
                          disabled={isLoading}
                        >
                          <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                          onPress={handleLogin}
                          activeOpacity={0.8}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <ActivityIndicator color="#18172A" />
                          ) : (
                            <Text style={styles.loginButtonText}>SE CONNECTER</Text>
                          )}
                        </TouchableOpacity>

                        <View style={styles.signupContainer}>
                          <Text style={styles.signupText}>Pas encore de compte ? </Text>
                          <TouchableOpacity 
                            onPress={() => setViewMode("signup")}
                            disabled={isLoading}
                          >
                            <Text style={styles.signupLink}>S&apos;inscrire</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}

                    {/* Vue Inscription */}
                    {viewMode === "signup" && (
                      <>
                        <Text style={styles.sheetTitle}>Inscription</Text>
                        
                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Prénom (optionnel)</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Ton prénom"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            value={firstName}
                            onChangeText={setFirstName}
                            editable={!isLoading}
                          />
                        </View>

                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Nom (optionnel)</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="Ton nom"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            value={lastName}
                            onChangeText={setLastName}
                            editable={!isLoading}
                          />
                        </View>

                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Email *</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="ton@email.com"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isLoading}
                          />
                        </View>

                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Mot de passe * (min. 8 caractères)</Text>
                          <View style={styles.passwordContainer}>
                            <TextInput
                              style={styles.passwordInput}
                              placeholder="••••••••"
                              placeholderTextColor="rgba(255, 255, 255, 0.5)"
                              value={password}
                              onChangeText={setPassword}
                              secureTextEntry={!showPassword}
                              editable={!isLoading}
                            />
                            <TouchableOpacity 
                              onPress={() => setShowPassword(!showPassword)}
                              style={styles.eyeIcon}
                              disabled={isLoading}
                            >
                              <Ionicons 
                                name={showPassword ? "eye-off" : "eye"} 
                                size={20} 
                                color="#FFFFFF" 
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Confirmation mot de passe *</Text>
                          <View style={styles.passwordContainer}>
                            <TextInput
                              style={styles.passwordInput}
                              placeholder="••••••••"
                              placeholderTextColor="rgba(255, 255, 255, 0.5)"
                              value={confirmPassword}
                              onChangeText={setConfirmPassword}
                              secureTextEntry={!showConfirmPassword}
                              editable={!isLoading}
                            />
                            <TouchableOpacity 
                              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                              style={styles.eyeIcon}
                              disabled={isLoading}
                            >
                              <Ionicons 
                                name={showConfirmPassword ? "eye-off" : "eye"} 
                                size={20} 
                                color="#FFFFFF" 
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <TouchableOpacity 
                          style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                          onPress={handleSignup}
                          activeOpacity={0.8}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <ActivityIndicator color="#18172A" />
                          ) : (
                            <Text style={styles.loginButtonText}>S&apos;INSCRIRE</Text>
                          )}
                        </TouchableOpacity>

                        <View style={styles.signupContainer}>
                          <Text style={styles.signupText}>Déjà un compte ? </Text>
                          <TouchableOpacity 
                            onPress={() => setViewMode("login")}
                            disabled={isLoading}
                          >
                            <Text style={styles.signupLink}>Se connecter</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}

                    {/* Vue Mot de passe oublié */}
                    {viewMode === "forgot" && (
                      <>
                        <Text style={styles.sheetTitle}>Mot de passe oublié</Text>
                        
                        <Text style={styles.forgotDescription}>
                          Entre ton email et nous t&apos;enverrons un lien pour réinitialiser ton mot de passe.
                        </Text>

                        <View style={styles.inputContainer}>
                          <Text style={styles.inputLabel}>Email</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="ton@email.com"
                            placeholderTextColor="rgba(255, 255, 255, 0.5)"
                            value={resetEmail}
                            onChangeText={setResetEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
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
                            <ActivityIndicator color="#18172A" />
                          ) : (
                            <Text style={styles.loginButtonText}>ENVOYER</Text>
                          )}
                        </TouchableOpacity>

                        <View style={styles.signupContainer}>
                          <TouchableOpacity 
                            onPress={() => setViewMode("login")}
                            disabled={isLoading}
                          >
                            <Text style={styles.signupLink}>← Retour à la connexion</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </ScrollView>
                </BlurView>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18172A",
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.5,
    zIndex: 0,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
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
    color: "#FFFFFF",
    fontSize: RESPONSIVE.skipFontSize,
    fontWeight: "600",
    fontFamily: "KumbhSans_700Bold",
  },
  content: {
    position: "absolute",
    top: SCREEN_HEIGHT * 0.55,
    left: RESPONSIVE.horizontalPadding,
    width: SCREEN_WIDTH - (RESPONSIVE.horizontalPadding * 2),
    alignItems: "center",
    gap: SCREEN_HEIGHT * 0.03,
    zIndex: 2,
  },
  title: {
    color: "#FFFFFF",
    fontFamily: "KumbhSans_800ExtraBold",
    fontSize: RESPONSIVE.titleFontSize,
    lineHeight: RESPONSIVE.titleLineHeight,
    textAlign: "center",
  },
  emailButton: {
    width: "100%",
    height: RESPONSIVE.buttonHeight,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  emailText: {
    color: "#18172A",
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
    backgroundColor: "#1F1E33",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
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
  
  // 🎨 GLASSMORPHISM BOTTOM SHEET STYLES
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
  },
  bottomSheet: {
    width: SCREEN_WIDTH,
    maxHeight: SCREEN_HEIGHT * 0.85,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(24, 23, 42, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 20,
  },
  sheetHandle: {
    width: 45,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  sheetContent: {
    padding: RESPONSIVE.horizontalPadding,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  sheetTitle: {
    fontSize: Math.min(Math.max(SCREEN_WIDTH * 0.065, 24), 30),
    fontFamily: 'KumbhSans_800ExtraBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.03,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  inputContainer: {
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  inputLabel: {
    fontSize: Math.min(Math.max(SCREEN_WIDTH * 0.035, 13), 16),
    fontFamily: 'KumbhSans_700Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: Math.max(50, SCREEN_HEIGHT * 0.06),
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: Math.min(Math.max(SCREEN_WIDTH * 0.04, 14), 16),
    fontFamily: 'KumbhSans_700Bold',
    color: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    height: Math.max(50, SCREEN_HEIGHT * 0.06),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: Math.min(Math.max(SCREEN_WIDTH * 0.04, 14), 16),
    fontFamily: 'KumbhSans_700Bold',
    color: '#FFFFFF',
  },
  eyeIcon: {
    paddingHorizontal: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  forgotPasswordText: {
    fontSize: Math.min(Math.max(SCREEN_WIDTH * 0.035, 13), 15),
    fontFamily: 'KumbhSans_700Bold',
    color: '#FFFFFF',
  },
  forgotDescription: {
    fontSize: Math.min(Math.max(SCREEN_WIDTH * 0.035, 13), 15),
    fontFamily: 'KumbhSans_700Bold',
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.03,
    paddingHorizontal: 10,
  },
  loginButton: {
    width: '100%',
    height: RESPONSIVE.buttonHeight,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: RESPONSIVE.emailFontSize,
    fontFamily: 'KumbhSans_700Bold',
    color: '#18172A',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: Math.min(Math.max(SCREEN_WIDTH * 0.035, 13), 15),
    fontFamily: 'KumbhSans_700Bold',
    color: '#FFFFFF',
  },
  signupLink: {
    fontSize: Math.min(Math.max(SCREEN_WIDTH * 0.035, 13), 15),
    fontFamily: 'KumbhSans_700Bold',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});