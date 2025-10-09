import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Calendar,
  ChevronLeft,
  MessageSquareShare,
  Plus,
  Minus,
} from "lucide-react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function TendancesPage() {
  const ticketTypes = ["VIP", "PREMIUM", "STANDARD"] as const;
  type TicketType = typeof ticketTypes[number];

  const ticketPrices: Record<TicketType, number> = {
    VIP: 100000,
    PREMIUM: 50000,
    STANDARD: 10000,
  };

  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const router = useRouter();

  const [count, setCount] = useState(1);

  const responsiveFont = SCREEN_WIDTH * 0.032;

  const totalPrice =
    selectedTicket ? ticketPrices[selectedTicket] * count : 0;

  return (
    <View style={styles.container}>
      {/* HEADER RESPONSIVE */}
      <View style={styles.header}>
        <ChevronLeft width={24} height={24} color="#FFFFFF" />
        <MessageSquareShare width={24} height={24} color="#FFFFFF" />
      </View>

      {/* IMAGE DE FOND */}
      <ImageBackground
        source={require("@/assets/images/Asake.png")}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(99,7,19,0.75)", "rgba(34,33,51,0.45)", "#18172A"]}
          style={StyleSheet.absoluteFillObject}
        />
      </ImageBackground>

      <View style={styles.bottomSection}>
        <Text style={styles.title}>WeLoveEya - Festival</Text>

        <Text style={styles.description}>
          Les fans de musique Afrobeat et Urbaine du monde entier se donnent
          rendez-vous à Cotonou... plus
        </Text>

        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={20} color="#6B6A7F" />
          <Text style={styles.infoText}>Cotonou Place de l’Amazone</Text>
        </View>

        {/* LIGNE SÉPARATRICE */}
        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Calendar size={20} color="#6B6A7F" />
          <Text style={styles.date}>27 & 28 DEC | 17H</Text>
        </View>

        {/* LIGNE SÉPARATRICE */}
        <View style={styles.separator} />

        <Text style={styles.tickets}>Nos tickets</Text>

        {/* BOUTONS VIP / PREMIUM / STANDARD */}
        <View style={styles.buttonRow}>
          {ticketTypes.map((label) => {
            const isActive = selectedTicket === label;
            return (
              <TouchableOpacity
                key={label}
                activeOpacity={0.9}
                style={[
                  styles.ticketButton,
                  isActive && styles.activeTicketButton,
                ]}
                onPress={() => setSelectedTicket(isActive ? null : label)}
              >
                <Text
                  style={[
                    styles.ticketButtonText,
                    { fontSize: responsiveFont },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* COMPOSANT D’INCREMENTATION */}
        <View style={styles.incrementationWrapper}>
          <View style={styles.counterLayout}>
           <TouchableOpacity
  style={[
    styles.counterButton,
    count === 1 && { borderColor: "#6B6A7F" }, // bordure grise si count = 1
  ]}
  onPress={() => setCount(count > 1 ? count - 1 : 1)}
>
  <Minus size={16} color="#FFFFFF" />
</TouchableOpacity>


            <Text style={styles.counterNumber}>{count}</Text>

            <TouchableOpacity
              style={styles.counterButton}
              onPress={() => setCount(count + 1)}
            >
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* BOUTON DU BAS */}
        
<TouchableOpacity
  style={styles.bottomButton}
  onPress={() => {
    if (selectedTicket) {
      router.push({
        pathname: "/(tabs)/event/checkout",
        params: {
          price: totalPrice.toString(),
          ticket: selectedTicket,
          count: count.toString(),
        },
      } as any);
    }
  }}
>
  <Text style={styles.bottomButtonText}>
    {selectedTicket
      ? `MAINTENANT À ${totalPrice.toLocaleString()} F CFA`
      : "CHOISISSEZ UN TICKET"}
  </Text>
</TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#18172A" },

  header: {
    width: "90%",
    height: SCREEN_HEIGHT * 0.035,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: SCREEN_HEIGHT * 0.035,
    left: SCREEN_WIDTH * 0.04,
    zIndex: 10,
  },

  imageBackground: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.55 },

bottomSection: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    justifyContent: "flex-start",
    paddingBottom: SCREEN_HEIGHT * 0.02,
    marginTop: -SCREEN_HEIGHT * 0.03, // remonte tout le bloc
  },


  title: {
    color: "#FFFFFF",
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.045,
    marginTop: SCREEN_HEIGHT * 0.01,
  },
  description: {
    color: "#FFFFFF",
    fontFamily: "KumbhSans_400Regular",
    fontSize: SCREEN_WIDTH * 0.035,
    marginVertical: SCREEN_HEIGHT * 0.01,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 5,
  },
  infoText: {
    color: "#FFFFFF",
    fontFamily: "KumbhSans_600SemiBold",
    fontSize: SCREEN_WIDTH * 0.032,
  },
  date: {
    color: "#FCC017",
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.032,
    marginTop: 4,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: "#FFFFFF05",
    width: SCREEN_WIDTH * 0.9,
    marginVertical: 8,
  },
  tickets: {
    color: "#FFFFFF",
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.045,
    marginVertical: SCREEN_HEIGHT * 0.015,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  ticketButton: {
    flex: 1,
    backgroundColor: "#26253B",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: SCREEN_HEIGHT * 0.03,
    marginHorizontal: 4,
  },
  activeTicketButton: {
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  ticketButtonText: {
    color: "#FFFFFF",
    fontFamily: "KumbhSans_700Bold",
    textAlign: "center",
  },
  ticketPrice: {
    color: "#FCC017",
    fontFamily: "KumbhSans_600SemiBold",
    fontSize: SCREEN_WIDTH * 0.028,
    marginTop: 4,
  },

  incrementationWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: SCREEN_HEIGHT * 0.008,
  },
  counterLayout: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.035,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counterButton: {
  width: 30,
  height: 30,
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 15,
  borderWidth: 2.67,
  borderColor: "#FFFFFF", // couleur par défaut
},

  counterNumber: {
    fontFamily: "KumbhSans_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
    textAlign: "center",
  },

  bottomButton: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.065,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SCREEN_HEIGHT * 0.005,
  },
  bottomButtonText: {
    fontFamily: "KumbhSans_700Bold",
    fontSize: SCREEN_WIDTH * 0.035,
    color: "#18172A",
    textAlign: "center",
  },
});
