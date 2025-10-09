import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import { ScanLine } from "lucide-react-native";
import TicketCard from "@/components/TicketCard";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function Tickets() {
  const [active, setActive] = useState("A venir");

  const menuItems = ["A venir", "Passées"];

  // Données exemple des tickets
  const tickets = [
    {
      id: 1,
      ticketCode: "#TWLVE-17828652-CCV9",
      price: "10.000 FCFA",
      date: "12-12-2025",
      type: "Ticket standard",
    },
    {
      id: 2,
      ticketCode: "#TWLVE-17828652-AAA1",
      price: "15.000 FCFA",
      date: "15-12-2025",
      type: "Ticket VIP",
    },
    {
      id: 3,
      ticketCode: "#TWLVE-17828652-BBB2",
      price: "8.000 FCFA",
      date: "20-12-2025",
      type: "Ticket standard",
    },
  ];

  return (
    <View style={styles.container}>
      {/* En-tête avec titre et icône scan */}
      <View style={styles.header}>
        <Text style={styles.title}>Mes Tickets</Text>
        <TouchableOpacity style={styles.scanButton}>
          <ScanLine size={24} color="white" />
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

      {/* Liste des tickets */}
      <ScrollView
        style={styles.ticketsListContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ticketsList}
      >
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticketCode={ticket.ticketCode}
            price={ticket.price}
            date={ticket.date}
            type={ticket.type}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18172A",
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
    color: "#FFFFFF",
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
  ticketsListContainer: {
    flex: 1,
  },
  ticketsList: {
    paddingHorizontal: SCREEN_WIDTH * 0.035,
    paddingBottom: 20,
  },
});