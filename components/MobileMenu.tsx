import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, ActivityIndicator, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ticket, UserRound } from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";
import { useFonts } from 'expo-font';
import { BlurView } from 'expo-blur';
import {
  KumbhSans_400Regular,
  KumbhSans_500Medium,
  KumbhSans_700Bold
} from '@expo-google-fonts/kumbh-sans';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ICON_SIZE = 25;

const MobileMenu = ({ activeTab, setActiveTab }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Chargement des polices
  const [fontsLoaded] = useFonts({
    'KumbhSans_400Regular': KumbhSans_400Regular,
    'KumbhSans_500Medium': KumbhSans_500Medium,
    'KumbhSans_700Bold': KumbhSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#18172A" />
      </View>
    );
  }

  const menuItems = [
    {
      name: "Accueil",
      icon: (color: string) => (
        <MaterialCommunityIcons name="lightning-bolt" size={ICON_SIZE} color={color} />
      ),
      route: "/dashboard",
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
    pathname?.includes("tendances") ||
    pathname?.includes("checkout")
  ) {
    return null;
  }

  return (
    <View style={styles.blurContainer}>
      <BlurView 
        intensity={25} 
        tint="light" 
        style={styles.blurView}
      >
        <View style={styles.container}>
          {menuItems.map((item) => {
            const isActive = activeTab === item.name;
            const color = isActive ? "#18172A" : "#FFFFFF";
            
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.menuItem, isActive && styles.activeItem]}
                onPress={() => handlePress(item)}
                activeOpacity={0.9}
              >
                <View style={styles.iconContainer}>
                  {item.icon(color)}
                </View>
                {isActive && <Text style={styles.activeText}>{item.name}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  blurView: {
    flex: 1,
    padding: 8,
    borderRadius: 24,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 40,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: SCREEN_WIDTH * 0.32,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 50,
    paddingHorizontal: 12,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeText: {
    color: '#18172A',
    fontFamily: 'KumbhSans_700Bold',
    fontSize: 13,
    lineHeight: 16,
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  }
});

export default MobileMenu;
