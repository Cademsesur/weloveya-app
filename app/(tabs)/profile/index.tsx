import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Settings, LogOut } from "lucide-react-native";
import { useAuth } from "@/services/contexts/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Profile() {
  const { user, logout, isLoading } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstname || "");
  const [lastName, setLastName] = useState(user?.lastname || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone_number || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Es-tu sûr de vouloir te déconnecter ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Déconnexion",
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert("Erreur", "Impossible de se déconnecter");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleOpenEdit = () => {
    setFirstName(user?.firstname || "");
    setLastName(user?.lastname || "");
    setEmail(user?.email || "");
    setPhone(user?.phone_number || "");
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    // Validation
    if (!email) {
      Alert.alert("Erreur", "L'email est obligatoire");
      return;
    }

    setIsSaving(true);
    
    try {
      // Ici tu vas appeler l'API pour mettre à jour les infos
      // await ApiService.updateProfile({ firstName, lastName, email, phone });
      
      // Simulation d'un délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert("Succès", "Tes informations ont été mises à jour");
      setShowEditModal(false);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de mettre à jour tes informations");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    if (user?.firstname && user?.lastname) {
      return `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase();
    }
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    if (user?.firstname && user?.lastname) {
      return `${user.firstname} ${user.lastname}`;
    }
    if (user?.name) {
      return user.name;
    }
    return user?.email || "Utilisateur";
  };

  return (
    <View style={styles.container}>
      {/* Header avec dégradé */}
      <LinearGradient
        colors={["#630713", "#18172A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mon Profil</Text>
        
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <View style={styles.onlineIndicator} />
        </View>

        {/* Nom de l'utilisateur */}
        <Text style={styles.userName}>{getDisplayName()}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Section Paramètres */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>

          <TouchableOpacity 
            style={styles.menuCard}
            onPress={handleOpenEdit}
            activeOpacity={0.7}
          >
            <View style={styles.menuIconContainer}>
              <Settings size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.menuText}>Paramètres du compte</Text>
            <Ionicons name="chevron-forward" size={20} color="#6B6A7F" />
          </TouchableOpacity>
        </View>

        {/* Bouton Déconnexion */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de modification */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowEditModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
              >
                <BlurView intensity={90} tint="light" style={styles.bottomSheet}>
                  <View style={styles.sheetHandle} />
                  
                  <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.sheetContent}
                  >
                    <Text style={styles.sheetTitle}>Paramètres du compte</Text>
                    
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Prénom</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Ton prénom"
                        placeholderTextColor="#6B6A7F"
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
                        placeholderTextColor="#6B6A7F"
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
                        placeholderTextColor="#6B6A7F"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isSaving}
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Téléphone</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="+229 XX XX XX XX"
                        placeholderTextColor="#6B6A7F"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
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
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text style={styles.saveButtonText}>ENREGISTRER</Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => setShowEditModal(false)}
                      disabled={isSaving}
                    >
                      <Text style={styles.cancelButtonText}>Annuler</Text>
                    </TouchableOpacity>
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
  header: {
    paddingTop: Platform.OS === "ios" ? SCREEN_HEIGHT * 0.07 : SCREEN_HEIGHT * 0.05,
    paddingBottom: SCREEN_HEIGHT * 0.03,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: SCREEN_WIDTH * 0.06,
    fontFamily: "KumbhSans_800ExtraBold",
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  avatar: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_WIDTH * 0.25,
    borderRadius: SCREEN_WIDTH * 0.125,
    backgroundColor: "#FCC017",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  avatarText: {
    color: "#18172A",
    fontSize: SCREEN_WIDTH * 0.1,
    fontFamily: "KumbhSans_800ExtraBold",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#34C759",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  userName: {
    color: "#FFFFFF",
    fontSize: SCREEN_WIDTH * 0.055,
    fontFamily: "KumbhSans_800ExtraBold",
    marginBottom: 5,
  },
  userEmail: {
    color: "#FFFFFF99",
    fontSize: SCREEN_WIDTH * 0.035,
    fontFamily: "KumbhSans_700Bold",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingTop: SCREEN_HEIGHT * 0.02,
    paddingBottom: SCREEN_HEIGHT * 0.1,
  },
  section: {
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: SCREEN_WIDTH * 0.045,
    fontFamily: "KumbhSans_800ExtraBold",
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F1E33",
    borderRadius: 15,
    padding: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_HEIGHT * 0.012,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#18172A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SCREEN_WIDTH * 0.03,
  },
  menuText: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: SCREEN_WIDTH * 0.038,
    fontFamily: "KumbhSans_700Bold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F1E33",
    borderRadius: 15,
    padding: SCREEN_WIDTH * 0.04,
    marginTop: SCREEN_HEIGHT * 0.02,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: SCREEN_WIDTH * 0.04,
    fontFamily: "KumbhSans_800ExtraBold",
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  keyboardView: {
    width: "100%",
  },
  bottomSheet: {
    width: SCREEN_WIDTH,
    maxHeight: SCREEN_HEIGHT * 0.85,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(24, 23, 42, 0.3)",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  sheetContent: {
    padding: SCREEN_WIDTH * 0.05,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  sheetTitle: {
    fontSize: Math.min(Math.max(SCREEN_WIDTH * 0.065, 24), 30),
    fontFamily: "KumbhSans_800ExtraBold",
    color: "#18172A",
    textAlign: "center",
    marginBottom: SCREEN_HEIGHT * 0.03,
  },
  inputContainer: {
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  inputLabel: {
    fontSize: Math.min(Math.max(SCREEN_WIDTH * 0.035, 13), 16),
    fontFamily: "KumbhSans_700Bold",
    color: "#18172A",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: Math.max(50, SCREEN_HEIGHT * 0.06),
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: Math.min(Math.max(SCREEN_WIDTH * 0.04, 14), 16),
    fontFamily: "KumbhSans_700Bold",
    color: "#18172A",
    borderWidth: 1,
    borderColor: "rgba(24, 23, 42, 0.2)",
  },
  saveButton: {
    width: "100%",
    height: Math.max(SCREEN_HEIGHT * 0.07, 50),
    backgroundColor: "#18172A",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SCREEN_HEIGHT * 0.02,
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: Math.min(Math.max(SCREEN_WIDTH * 0.04, 14), 18),
    fontFamily: "KumbhSans_700Bold",
    color: "#FFFFFF",
  },
  cancelButton: {
    width: "100%",
    height: Math.max(SCREEN_HEIGHT * 0.06, 45),
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: Math.min(Math.max(SCREEN_WIDTH * 0.038, 14), 16),
    fontFamily: "KumbhSans_700Bold",
    color: "#18172A",
    textDecorationLine: "underline",
  },
});