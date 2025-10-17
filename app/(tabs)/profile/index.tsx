import { useAuth } from "@/services/contexts/AuthContext";
import { useTheme } from "@/services/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { LogOut, Settings } from "lucide-react-native";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Profile() {
  const { user, logout, isLoading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

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
          onPress: () => {
            // Ne pas attendre la déconnexion pour naviguer
            // La navigation se fait maintenant dans la fonction logout
            logout().catch(() => {
              // Si une erreur survient après la navigation, on l'affiche
              Alert.alert("Erreur", "Une erreur est survenue lors de la déconnexion");
            });
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleOpenSettings = () => {
    router.push("/profile/settings");
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
            onPress={handleOpenSettings}
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
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? SCREEN_HEIGHT * 0.11 : SCREEN_HEIGHT * 0.09, // Augmente l'espace en haut
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
    color: theme.text,
    fontSize: SCREEN_WIDTH * 0.045,
    fontFamily: "KumbhSans_800ExtraBold",
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    borderRadius: 15,
    padding: SCREEN_WIDTH * 0.04,
    marginBottom: SCREEN_HEIGHT * 0.012,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SCREEN_WIDTH * 0.03,
  },
  menuText: {
    flex: 1,
    color: theme.text,
    fontSize: SCREEN_WIDTH * 0.038,
    fontFamily: "KumbhSans_700Bold",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface,
    borderRadius: 15,
    padding: SCREEN_WIDTH * 0.04,
    marginTop: SCREEN_HEIGHT * 0.02,
    borderWidth: 1,
    borderColor: theme.error,
  },
  logoutText: {
    color: theme.error,
    fontSize: SCREEN_WIDTH * 0.04,
    fontFamily: "KumbhSans_800ExtraBold",
    marginLeft: 10,
  },
});