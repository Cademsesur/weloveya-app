import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface TicketCardProps {
  ticketCode: string;
  price: string | number;
  date: string;
  type: string;
}

export default function TicketCard({ ticketCode, price, date, type }: TicketCardProps) {
  return (
    <View style={styles.container}>
      {/* Image du ticket */}
      <Image
        source={require("@/assets/images/ticket2.png")}
        style={styles.ticketImage}
        resizeMode="contain"
      />

      {/* Informations du ticket */}
      <View style={styles.infoContainer}>
        {/* Ligne 1 */}
        <View style={styles.row}>
          <Text style={styles.ticketCode}>{ticketCode}</Text>
          <Text style={styles.price}>{price}</Text>
        </View>

        {/* Ligne 2 */}
        <View style={styles.row}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.type}>{type}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH - 28,
    height: 70,
    backgroundColor: "#26253B",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ticketImage: {
    width: 37,
    height: 55.52,
    marginLeft: 11,
    marginTop: 7,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
    paddingRight: 15,
  },
  ticketCode: {
    color: "#FFFFFF",
    fontFamily: "KumbhSans_700Bold",
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "center",
  },
  price: {
    color: "#FFFFFF",
    fontFamily: "KumbhSans_700Bold",
    fontSize: 14,
    lineHeight: 14,
    letterSpacing: 0,
    textAlign: "center",
  },
  date: {
    color: "#FFFFFF",
    fontFamily: "KumbhSans_400Regular",
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: 0,
    textAlign: "center",
  },
  type: {
    color: "#FFFFFF",
    fontFamily: "KumbhSans_400Regular",
    fontSize: 10,
    lineHeight: 10,
    letterSpacing: 0,
    textAlign: "center",
  },
});