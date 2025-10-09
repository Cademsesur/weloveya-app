import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import { Heart, MessageCircle, Send } from "lucide-react-native";
import { Event } from "../services/api";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface EventCardProps {
  event: Event;
  onPress: (event: Event) => void;
}

export default function EventCard({ event, onPress }: EventCardProps) {
  const formatDate = (startDate: string | null, endDate: string | null) => {
    if (!startDate) return "Date à confirmer";
    
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    const startDay = start.getDate();
    const endDay = end?.getDate();
    const month = start.toLocaleDateString("fr-FR", { month: "short" }).toUpperCase();
    const time = start.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    
    if (end && startDay !== endDay) {
      return `${startDay} & ${endDay} ${month} | ${time.replace(":", "H")}`;
    }
    
    return `${startDay} ${month} | ${time.replace(":", "H")}`;
  };

  // Simuler des stats (à remplacer par de vraies données si disponibles)
  const getRandomStat = (min: number, max: number) => {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const getPriceRange = () => {
    // À remplacer par les vrais prix des pass types
    return "10 000 à 150 000 FCFA";
  };

  return (
    <View style={styles.container}>
      {/* Image principale (cliquable) */}
      <TouchableOpacity
        onPress={() => onPress(event)}
        activeOpacity={0.9}
        style={styles.clickable}
      >
        {event.banner_url ? (
          <Image
            source={{ uri: event.banner_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>Aucune image</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Ligne des icônes (non cliquables) */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Heart size={SCREEN_WIDTH * 0.055} color="#FFFFFF" />
          <Text style={styles.statText}>{getRandomStat(1000, 2000000)}</Text>
        </View>

        <View style={styles.statItem}>
          <MessageCircle size={SCREEN_WIDTH * 0.055} color="#FFFFFF" />
          <Text style={styles.statText}>{getRandomStat(100, 20000)}</Text>
        </View>

        <View style={styles.statItem}>
          <Send size={SCREEN_WIDTH * 0.055} color="#FFFFFF" />
          <Text style={styles.statText}>{getRandomStat(50, 10000)}</Text>
        </View>
      </View>

      {/* Infos sous les icônes (cliquables) */}
      <TouchableOpacity
        onPress={() => onPress(event)}
        activeOpacity={0.9}
        style={styles.clickable}
      >
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>
            {event.name}
            {event.category && ` - ${event.category}`}
          </Text>
          
          {event.location && (
            <Text style={styles.infoLocation}>{event.location}</Text>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoDate}>
              {formatDate(event.start_date, event.end_date)}
            </Text>
            <Text style={styles.infoPrice}>{getPriceRange()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SCREEN_HEIGHT * 0.02,
    alignItems: "flex-start",
    width: SCREEN_WIDTH,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  clickable: {
    cursor: Platform.OS === "web" ? "pointer" : undefined,
  },
  image: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.5,
    borderRadius: SCREEN_WIDTH * 0.05,
  },
  placeholderImage: {
    backgroundColor: "#1F1E33",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#6B6A7F",
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.04,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SCREEN_WIDTH * 0.07,
    width: SCREEN_WIDTH * 0.65,
    marginTop: SCREEN_HEIGHT * 0.015,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SCREEN_WIDTH * 0.015,
  },
  statText: {
    color: "#FFFFFF",
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.04,
  },
  infoSection: {
    marginTop: SCREEN_HEIGHT * 0.015,
    width: SCREEN_WIDTH * 0.9,
  },
  infoTitle: {
    color: "#FFFFFF",
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.045,
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  infoLocation: {
    color: "#6B6A7F",
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.035,
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SCREEN_WIDTH * 0.04,
  },
  infoDate: {
    color: "#FCC017",
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.035,
  },
  infoPrice: {
    color: "#FFFFFF",
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.03,
  },
});