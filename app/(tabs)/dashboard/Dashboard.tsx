import { useTheme } from "@/services/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Moon, Sun } from "lucide-react-native";
import { useFonts } from 'expo-font';
import { KumbhSans_400Regular, KumbhSans_500Medium, KumbhSans_700Bold } from '@expo-google-fonts/kumbh-sans';
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ApiService, { EventDetail, Tag } from "../../../services/api";
import EventCard from "@/components/TendancesSection";

// On détecte les dimensions dynamiques de l'écran
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const Dashboard = () => {
  const { theme, toggleTheme } = useTheme();
  
  // Chargement des polices
  const [fontsLoaded] = useFonts({
    'KumbhSans_400Regular': KumbhSans_400Regular,
    'KumbhSans_500Medium': KumbhSans_500Medium,
    'KumbhSans_700Bold': KumbhSans_700Bold,
  });

  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventDetail[]>([]);
  const [categories, setCategories] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    SCREEN_WIDTH > SCREEN_HEIGHT ? "landscape" : "portrait"
  );

  // Charger les catégories
  const loadCategories = useCallback(async () => {
    try {
      const response = await ApiService.getEventTags();
      setCategories(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
    }
  }, []);

  // Charger les événements
  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getAllEvents();
      setEvents(response.data);
      setFilteredEvents(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
      Alert.alert("Erreur", "Impossible de charger les événements");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Gérer le changement d'orientation
  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    const subscription = Dimensions.addEventListener('change', updateOrientation);
    return () => {
      subscription.remove();
    };
  }, []);

  // Charger les données initiales
  useEffect(() => {
    loadCategories();
    loadEvents();
  }, [loadCategories, loadEvents]);

  // Filtrer les événements par catégorie
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredEvents(events);
    } else {
      const categoryName = categories.find(cat => cat.id === activeCategory)?.name.toLowerCase();
      const filtered = events.filter(
        event => event.category?.toLowerCase() === categoryName
      );
      setFilteredEvents(filtered);
    }
  }, [activeCategory, events, categories]);

  // Rafraîchir les données
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([loadEvents(), loadCategories()]);
    setIsRefreshing(false);
  }, [loadEvents, loadCategories]);

  // Gérer le clic sur un événement
  const handleEventPress = (event: EventDetail) => {
    router.push({
      pathname: "/(tabs)/event/tendances",
      params: { id: event.id.toString() },
    });
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const { styles, iconSize } = getResponsiveStyles(orientation, theme);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      
      {/* En-tête avec les catégories */}
      <View style={[styles.topMenu, { paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight }]}>
        <View style={styles.headerContent}>
          <View style={styles.menuContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.menuScroll}
              style={styles.hiddenScrollbar}
            >
            <TouchableOpacity
              style={[
                styles.menuItem,
                activeCategory === 'all' && styles.activeMenuItem,
              ]}
              onPress={() => setActiveCategory('all')}
            >
              <Text
                style={[
                  styles.menuItemText,
                  activeCategory === 'all' && styles.activeMenuItemText,
                ]}
              >
                Tous
              </Text>
            </TouchableOpacity>

            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.menuItem,
                  activeCategory === category.id && styles.activeMenuItem,
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <Text
                  style={[
                    styles.menuItemText,
                    activeCategory === category.id && styles.activeMenuItemText,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
            </ScrollView>
          </View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={iconSize} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
              {theme.isDark ? (
                <Sun size={iconSize} color={theme.primary} />
              ) : (
                <Moon size={iconSize} color={theme.text} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Contenu principal */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={theme.primary}
              colors={[theme.primary]}
            />
          }
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeCategory === 'all' 
                ? "Tendances" 
                : categories.find(cat => cat.id === activeCategory)?.name || 'Catégorie'}
            </Text>
          </View>

          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={handleEventPress}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="calendar-outline"
                size={iconSize * 2.5}
                color="#6B6A7F"
              />
              <Text style={styles.emptyTitle}>Aucun événement</Text>
              <Text style={styles.emptyText}>
                {activeCategory === 'all'
                  ? "Aucun événement disponible pour le moment"
                  : "Aucun événement dans cette catégorie"}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

/* ----------------------------
     Styles dynamiques responsive
---------------------------- */
const getResponsiveStyles = (orientation: "portrait" | "landscape", theme: any) => {
  const { width, height } = Dimensions.get("window");
  const baseWidth = orientation === "portrait" ? width : height;
  const ratio = baseWidth / 375; // iPhone 12 de référence

  const styles = StyleSheet.create({
    filterContainer: {
      marginLeft: 10,
    },
    menuContainer: {
      flex: 1,
      marginRight: 12,
      overflow: 'hidden',
    },
    menuScroll: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingBottom: 12,
    },
    menuItem: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 10,
      marginVertical: 4,
      backgroundColor: theme.isDark ? '#2A2940' : '#F0F0F0',
      elevation: 2,
      shadowColor: theme.isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    activeMenuItem: {
      backgroundColor: theme.isDark ? '#FCC017' : theme.primary,
    },
    menuItemText: {
      color: theme.text,
      fontFamily: 'KumbhSans_500Medium',
      fontSize: 14 * ratio,
    },
    activeMenuItemText: {
      color: theme.isDark ? '#000' : '#FFF',
    },
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === "ios" ? height * 0.07 : height * 0.05,
    },
    topMenu: {
      width: "100%",
      backgroundColor: 'transparent',
      paddingBottom: 10,
    },
    headerContent: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 10,
      paddingHorizontal: width * 0.05,
    },
    buttonsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 'auto', // Pousse le conteneur vers la droite
    },
    menuButton: {
      backgroundColor: theme.isDark ? "#FFFFFF12" : theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      marginRight: width * 0.025,
      paddingHorizontal: width * 0.04,
    },
    menuButtonActive: {
      backgroundColor: theme.primary,
    },
    menuText: {
      color: theme.text,
      fontFamily: "KumbhSans_700Bold",
      fontSize: 14 * ratio,
      textAlign: "center",
    },
    menuTextActive: {
      color: theme.primaryText,
    },
    filterButton: {
      width: 34 * ratio,
      height: 34 * ratio,
      borderRadius: 17 * ratio,
      backgroundColor: theme.isDark ? "#FFFFFF12" : theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 6 * ratio,
    },
    themeButton: {
      width: 34 * ratio,
      height: 34 * ratio,
      borderRadius: 17 * ratio,
      backgroundColor: theme.isDark ? "#FFFFFF12" : theme.surfaceVariant,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 6 * ratio,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      color: theme.text,
      fontSize: 16 * ratio,
      fontFamily: "KumbhSans_700Bold",
      marginTop: 15 * ratio,
    },
    scrollView: {
      flex: 1,
    },
    hiddenScrollbar: {
      // Masque la barre de défilement sur iOS
      // La propriété showsHorizontalScrollIndicator={false} s'occupe déjà de la masquer sur Android
    },
    scrollContent: {
      paddingBottom: 100 * ratio,
    },
    sectionHeader: {
      paddingHorizontal: width * 0.05,
      marginBottom: height * 0.01,
      marginTop: height * 0.03,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 24 * ratio,
      fontFamily: "KumbhSans_700Bold",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 60 * ratio,
    },
    emptyTitle: {
      color: theme.text,
      fontSize: 20 * ratio,
      fontFamily: "KumbhSans_700Bold",
      marginTop: 20 * ratio,
      marginBottom: 10 * ratio,
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize: 14 * ratio,
      fontFamily: "KumbhSans_500Medium",
      textAlign: "center",
      paddingHorizontal: 40 * ratio,
    },
  });

  return { styles, iconSize: 20 * ratio };
};

export default Dashboard;
