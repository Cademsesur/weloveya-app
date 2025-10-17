import { Heart, MessageCircle, Send } from "lucide-react-native";
import React from "react";
import { useFonts } from 'expo-font';
import { KumbhSans_400Regular, KumbhSans_500Medium, KumbhSans_700Bold } from '@expo-google-fonts/kumbh-sans';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { EventDetail } from "../services/api";
import { useTheme } from "../services/contexts/ThemeContext";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface EventCardProps {
  event: EventDetail;
  onPress: (event: EventDetail) => void;
}

export default function EventCard({ event, onPress }: EventCardProps) {
  const { theme } = useTheme();
  
  // Chargement des polices
  const [fontsLoaded] = useFonts({
    'KumbhSans_400Regular': KumbhSans_400Regular,
    'KumbhSans_500Medium': KumbhSans_500Medium,
    'KumbhSans_700Bold': KumbhSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ padding: 16, backgroundColor: theme.background, borderRadius: 12, marginBottom: 16 }}>
        <ActivityIndicator size="small" color={theme.primary} />
      </View>
    );
  }
  
  const formatDate = (startDate: string | null | undefined, endDate: string | null | undefined) => {
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
    try {
      // Vérifier si min_price-max_price existe
      const priceData = event['min_price-max_price'];
      
      // Si pas de données de prix, ne rien afficher
      if (!priceData) {
        return null;
      }
      
      // Si c'est déjà une string formatée (ex: "4 000 000 - 10 000 000")
      if (typeof priceData === 'string') {
        return `${priceData} FCFA`;
      }
      
      // Si c'est un objet avec min et max
      if (typeof priceData === 'object') {
        const formatPrice = (price: number) => {
          const rounded = Math.round(price);
          return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        };
        
        const minPrice = priceData.min;
        const maxPrice = priceData.max;
        
        // Si les deux sont null, ne rien afficher
        if (minPrice === null && maxPrice === null) {
          return null;
        }
        
        // Si les deux existent et sont des nombres
        if (typeof minPrice === 'number' && typeof maxPrice === 'number') {
          if (minPrice === maxPrice) {
            return `${formatPrice(minPrice)} FCFA`;
          }
          return `${formatPrice(minPrice)} à ${formatPrice(maxPrice)} FCFA`;
        }
        
        // Si seulement min existe
        if (typeof minPrice === 'number') {
          return `À partir de ${formatPrice(minPrice)} FCFA`;
        }
        
        // Si seulement max existe
        if (typeof maxPrice === 'number') {
          return `Jusqu'à ${formatPrice(maxPrice)} FCFA`;
        }
      }
      
      return null;
    } catch (error) {
      console.log('Erreur lors du formatage du prix:', error);
      return null;
    }
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
          <Image
            source={require("../assets/images/Asake.png")}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>

      {/* Ligne des icônes (non cliquables) */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Heart size={SCREEN_WIDTH * 0.055} color={theme.text} />
          <Text style={[styles.statText, { color: theme.text }]}>{getRandomStat(1000, 2000000)}</Text>
        </View>

        <View style={styles.statItem}>
          <MessageCircle size={SCREEN_WIDTH * 0.055} color={theme.text} />
          <Text style={[styles.statText, { color: theme.text }]}>{getRandomStat(100, 20000)}</Text>
        </View>

        <View style={styles.statItem}>
          <Send size={SCREEN_WIDTH * 0.055} color={theme.text} />
          <Text style={[styles.statText, { color: theme.text }]}>{getRandomStat(50, 10000)}</Text>
        </View>
      </View>

      {/* Infos sous les icônes (cliquables) */}
      <TouchableOpacity
        onPress={() => onPress(event)}
        activeOpacity={0.9}
        style={styles.clickable}
      >
        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>
            {event.name}
            {event.category && ` - ${event.category}`}
          </Text>
          
          {event.location && (
            <Text style={[styles.infoLocation, { color: theme.textSecondary }]}>{event.location}</Text>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoDate}>
              {formatDate(event.start_date, event.end_date)}
            </Text>
            {(() => {
              const price = getPriceRange();
              return price ? <Text style={[styles.infoPrice, { color: theme.text }]}>{price}</Text> : null;
            })()}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SCREEN_HEIGHT * 0.02,
    marginBottom: SCREEN_HEIGHT * 0.03,
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
    backgroundColor: "#1F1E33", // Placeholder statique
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
    marginTop: SCREEN_HEIGHT * 0.025,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: SCREEN_WIDTH * 0.015,
  },
  statText: {
    // color dynamique appliquée inline
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.04,
  },
  infoSection: {
    marginTop: SCREEN_HEIGHT * 0.025,
    width: SCREEN_WIDTH * 0.9,
  },
  infoTitle: {
    // color dynamique appliquée inline
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.045,
    marginBottom: SCREEN_HEIGHT * 0.008,
  },
  infoLocation: {
    // color dynamique appliquée inline
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.035,
    marginBottom: SCREEN_HEIGHT * 0.008,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SCREEN_WIDTH * 0.04,
  },
  infoDate: {
    color: "#FCC017", // Garder le jaune pour la date
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.03,
  },
  infoPrice: {
    // color dynamique appliquée inline
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.03,
  },
});