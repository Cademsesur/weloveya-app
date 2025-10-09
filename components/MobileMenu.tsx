import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ticket, UserRound } from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function MobileMenu({ activeTab, setActiveTab }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const ICON_SIZE = 25;

  const menuItems = [
    {
      name: "Accueil",
      icon: (color: string) => (
        <MaterialCommunityIcons name="flash" size={ICON_SIZE} color={color} />
      ),
      route: "/dashboard",
    },
    {
      name: "Recherche",
      icon: (color: string) => (
        <MaterialCommunityIcons
          name="archive-search-outline"
          size={ICON_SIZE}
          color={color}
        />
      ),
      route: "/search",
    },
    {
      name: "Tickets",
      icon: (color: string) => <Ticket size={ICON_SIZE} color={color} />,
      route: "/tickets",
    },
    {
      name: "Profil",
      icon: (color: string) => <UserRound size={ICON_SIZE} color={color} />,
      route: "/profile",
    },
  ];

  const handlePress = (item: any) => {
    setActiveTab(item.name);
    router.push(item.route);
  };

  // Exclure menu sur onboarding et tendances
  if (
    pathname?.includes("onboarding") ||
    pathname?.includes("tendances")   ||
    pathname?.includes("checkout")
  ) {
    return null;
  }

  return (
    <View style={styles.container}>
      {menuItems.map((item) => {
        const isActive = activeTab === item.name;
        const color = isActive ? "#18172A" : "#FFFFFF";

        return (
          <TouchableOpacity
            key={item.name}
            style={[styles.menuItem, isActive && styles.activeItem]}
            onPress={() => handlePress(item)}
            activeOpacity={0.85}
          >
            {item.icon(color)}
            {isActive && <Text style={styles.activeText}>{item.name}</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 75,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 999,
    shadowColor: "#18172A33",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 8,
    paddingHorizontal: 10,
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  activeItem: {
    backgroundColor: "#FFFFFF",
    width: SCREEN_WIDTH * 0.28,
    height: 53,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 999,
    gap: 10,
  },
  activeText: {
    color: "#18172A",
    fontFamily: "KumbhSans_700Bold",
    fontSize: 14,
  },
});
