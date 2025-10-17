import { useTheme } from "@/services/contexts/ThemeContext";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import { ScanLine } from "lucide-react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Tickets() {
  const { theme } = useTheme();
  const [active, setActive] = useState("A venir");

  const menuItems = ["A venir", "Passées"];

  const styles = getStyles(theme);

  return (
    <View style={styles.container}>
      {/* En-tête avec titre et icône scan */}
      <View style={styles.header}>
        <Text style={styles.title}>Mes Tickets</Text>
        <TouchableOpacity style={styles.scanButton}>
          <ScanLine size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Boutons A venir / Passées */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.menuButton,
              active === item && styles.menuButtonActive,
            ]}
            onPress={() => setActive(item)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.menuText,
                active === item && styles.menuTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Image du ticket */}
      <View style={styles.ticketContainer}>
        <Image
          source={require("@/assets/images/ticket1.png")}
          style={styles.ticketImage}
          resizeMode="contain"
        />
      </View>

      {/* Informations du ticket */}
      <View style={styles.ticketInfo}>
        {/* Première ligne */}
        <View style={styles.infoRow}>
          <Text style={styles.ticketCode}>#TWLVE-17828652-CCV9</Text>
          <Text style={styles.ticketDate}>2025-09-23 05:29:03</Text>
        </View>

        {/* Deuxième ligne */}
        <View style={styles.infoRow}>
          <Text style={styles.ticketName}>CheckMyTicket</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.buttonText}>Non activé</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: Platform.OS === "ios" ? SCREEN_HEIGHT * 0.07 : SCREEN_HEIGHT * 0.05,
  },
  header: {
    width: SCREEN_WIDTH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  title: {
    color: theme.text,
    fontSize: SCREEN_WIDTH * 0.065,
    fontFamily: "KumbhSans_700Bold",
  },
  scanButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    flexDirection: "row",
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  menuButton: {
    height: 34,
    borderRadius: 999,
    backgroundColor: theme.isDark ? "#FFFFFF12" : theme.surfaceVariant,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SCREEN_WIDTH * 0.025,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
  },
  menuButtonActive: {
    backgroundColor: theme.primary,
  },
  menuText: {
    color: theme.text,
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.035,
    textAlign: "center",
  },
  menuTextActive: {
    color: theme.primaryText,
  },
  ticketContainer: {
    paddingHorizontal: 15,
    marginTop: SCREEN_HEIGHT * 0.015,
  },
  ticketImage: {
    width: SCREEN_WIDTH - 30,
    height: (SCREEN_WIDTH - 30) * 1.5, // maintient le ratio 410/615
  },
  ticketInfo: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    marginTop: SCREEN_HEIGHT * 0.02,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  ticketCode: {
    color: theme.text,
    fontFamily: "KumbhSans_700Bold",
    fontSize: 16,
    lineHeight: 16,
    letterSpacing: 0,
    textAlign: "center",
  },
  ticketDate: {
    color: theme.textSecondary,
    fontFamily: "KumbhSans_700Bold",
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: 0,
    textAlign: "center",
  },
  ticketName: {
    color: theme.text,
    fontFamily: "KumbhSans_700Bold",
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "center",
  },
  actionButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    paddingVertical: 8,
    borderRadius: 999,
  },
  buttonText: {
    color: theme.primaryText,
    fontFamily: "KumbhSans_700Bold",
    fontSize: 12,
  },
});