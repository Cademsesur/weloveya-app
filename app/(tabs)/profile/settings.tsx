import { useAuth } from "@/services/contexts/AuthContext";
import { useTheme } from "@/services/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Calculs responsives optimisés (alignés avec les pages auth)
const RESPONSIVE = {
  headerPaddingTop: Platform.OS === "ios" 
    ? Math.min(Math.max(SCREEN_HEIGHT * 0.07, 50), 70)
    : Math.min(Math.max(SCREEN_HEIGHT * 0.05, 40), 60),
  headerPaddingBottom: Math.min(Math.max(SCREEN_HEIGHT * 0.03, 24), 35),
  contentPaddingTop: Math.min(Math.max(SCREEN_HEIGHT * 0.06, 45), 65),
  contentPaddingBottom: Math.min(Math.max(SCREEN_HEIGHT * 0.15, 110), 140),
  horizontalPadding: SCREEN_WIDTH * 0.05,
  inputMarginBottom: SCREEN_HEIGHT * 0.01,
  inputHeight: Math.max(50, SCREEN_HEIGHT * 0.06),
  buttonHeight: Math.max(SCREEN_HEIGHT * 0.07, 50),
  buttonMarginTop: SCREEN_HEIGHT * 0.02,
  buttonMarginBottom: SCREEN_HEIGHT * 0.02,
  backButtonSize: 44,
  iconSize: 28,
  titleFontSize: Math.min(Math.max(SCREEN_WIDTH * 0.048, 17), 20),
  labelFontSize: Math.min(Math.max(SCREEN_WIDTH * 0.035, 13), 16),
  inputFontSize: Math.min(Math.max(SCREEN_WIDTH * 0.04, 14), 16),
  buttonFontSize: Math.min(Math.max(SCREEN_WIDTH * 0.04, 14), 16),
};

export default function Settings() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [firstName, setFirstName] = useState(user?.firstname || "");
  const [lastName, setLastName] = useState(user?.lastname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    // Validation
    if (!email) {
      Alert.alert("Erreur", "L'email est obligatoire");
      return;
    }

    setIsSaving(true);
    
    try {
      // Ici tu vas appeler l'API pour mettre à jour les infos
      // await ApiService.updateProfile({ firstName, lastName, email });
      
      // Simulation d'un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert("Succès", "Tes informations ont été mises à jour");
      router.back();
    } catch {
      Alert.alert("Erreur", "Impossible de mettre à jour tes informations");
    } finally {
      setIsSaving(false);
    }
  };

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header avec dégradé */}
      <LinearGradient
        colors={["#630713", "#18172A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={RESPONSIVE.iconSize} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Paramètres du compte</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Prénom</Text>
          <TextInput
            style={styles.input}
            placeholder="Ton prénom"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={firstName}
            onChangeText={setFirstName}
            editable={!isSaving}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nom</Text>
          <TextInput
            style={styles.input}
            placeholder="Ton nom"
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={lastName}
            onChangeText={setLastName}
            editable={!isSaving}
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
            editable={!isSaving}
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveButton, isSaving && styles.buttonDisabled]}
          onPress={handleSaveChanges}
          activeOpacity={0.8}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#18172A" />
          ) : (
            <Text style={styles.saveButtonText}>ENREGISTRER</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingTop: RESPONSIVE.headerPaddingTop,
    paddingBottom: RESPONSIVE.headerPaddingBottom,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: RESPONSIVE.horizontalPadding,
  },
  backButton: {
    width: RESPONSIVE.backButtonSize,
    height: RESPONSIVE.backButtonSize,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: RESPONSIVE.titleFontSize,
    fontFamily: "KumbhSans_800ExtraBold",
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  placeholder: {
    width: RESPONSIVE.backButtonSize,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: RESPONSIVE.horizontalPadding,
    paddingTop: RESPONSIVE.contentPaddingTop,
    paddingBottom: RESPONSIVE.contentPaddingBottom,
  },
  inputContainer: {
    marginBottom: RESPONSIVE.inputMarginBottom,
  },
  inputLabel: {
    fontSize: RESPONSIVE.labelFontSize,
    fontFamily: "KumbhSans_700Bold",
    color: theme.text,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: RESPONSIVE.inputHeight,
    backgroundColor: theme.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: RESPONSIVE.inputFontSize,
    fontFamily: "KumbhSans_700Bold",
    color: theme.text,
    borderWidth: 0,
  },
  saveButton: {
    width: "100%",
    height: RESPONSIVE.buttonHeight,
    backgroundColor: theme.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: RESPONSIVE.buttonMarginTop,
    marginBottom: RESPONSIVE.buttonMarginBottom,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: RESPONSIVE.buttonFontSize,
    fontFamily: "KumbhSans_700Bold",
    color: theme.primaryText,
  },
});
