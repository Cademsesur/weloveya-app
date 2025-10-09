import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Heart } from "lucide-react-native";
import { router } from "expo-router";
import ApiService from "../../../services/api";
import EventCard from "@/components/TendancesSection";

type Event = {
  id: number | string;
  category?: string;
  [key: string]: any;
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Dashboard() {
  const [active, setActive] = useState("Tout");
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const menuItems = ["Tout", "Festival", "Concert"];

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [active, events]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await ApiService.getAllEvents();
      setEvents(response.data);
    } catch (error) {
      console.error("Erreur chargement events:", error);
      Alert.alert("Erreur", "Impossible de charger les événements");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadEvents();
    setIsRefreshing(false);
  };

  const filterEvents = () => {
    if (active === "Tout") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(
        (event) => event.category?.toLowerCase() === active.toLowerCase()
      );
      setFilteredEvents(filtered);
    }
  };

  const handleEventPress = (event: Event) => {
    // Navigation vers la page de détails de l'événement
    router.push({
      pathname: "/(tabs)/event/tendances",
      params: { id: event.id.toString() },
    });
  };

  const handleFavorites = () => {
    // Navigation vers la page des favoris
    Alert.alert("Favoris", "Fonctionnalité à venir");
  };

  return (
    <View style={styles.container}>
      {/* Menu du haut */}
      <View style={styles.topMenu}>
        {/* Partie gauche : boutons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.menuScroll}
        >
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

          {/* Bouton filtre circulaire */}
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </ScrollView>

        {/* Icône Heart à droite */}
        <TouchableOpacity style={styles.heartButton} onPress={handleFavorites}>
          <Heart size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Contenu principal */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FCC017" />
          <Text style={styles.loadingText}>Chargement des événements...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#FCC017"
              colors={["#FCC017"]}
            />
          }
        >
          {/* Titre de section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {active === "Tout" ? "Tendances" : active}
            </Text>
          </View>

          {/* Liste des événements */}
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
              <Ionicons name="calendar-outline" size={64} color="#6B6A7F" />
              <Text style={styles.emptyTitle}>Aucun événement</Text>
              <Text style={styles.emptyText}>
                {active === "Tout"
                  ? "Aucun événement disponible pour le moment"
                  : `Aucun événement dans la catégorie "${active}"`}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18172A",
    paddingTop: Platform.OS === "ios" ? SCREEN_HEIGHT * 0.07 : SCREEN_HEIGHT * 0.05,
  },
  topMenu: {
    width: SCREEN_WIDTH,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  menuScroll: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuButton: {
    height: 34,
    borderRadius: 999,
    backgroundColor: "#FFFFFF12",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SCREEN_WIDTH * 0.025,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
  },
  menuButtonActive: {
    backgroundColor: "#FCC017",
  },
  menuText: {
    color: "#FFFFFF",
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.035,
    textAlign: "center",
  },
  menuTextActive: {
    color: "#18172A",
  },
  filterButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF12",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  heartButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "KumbhSans_700Bold",
    marginTop: 15,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: SCREEN_WIDTH * 0.06,
    fontFamily: "KumbhSans_700Bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: SCREEN_WIDTH * 0.05,
    fontFamily: "KumbhSans_800ExtraBold",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    color: "#6B6A7F",
    fontSize: SCREEN_WIDTH * 0.038,
    fontFamily: "KumbhSans_700Bold",
    textAlign: "center",
    paddingHorizontal: 40,
  },
});