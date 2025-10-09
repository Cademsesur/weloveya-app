import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronLeft,
  MessageSquareShare,
  CreditCard,
  ChevronDown,
} from "lucide-react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CheckoutPage() {
  const route = useRoute();
  const navigation = useNavigation();

  const { price, ticket, count } = route.params as {
    price: string;
    ticket: string;
    count: string;
  };

  const totalPrice = parseInt(price);

  // État pour le mode de paiement
  const [paymentMode, setPaymentMode] = useState<"card" | "momo">("card");

  // États pour les inputs CARTE
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [country, setCountry] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // États pour les inputs MOMO
  const [operator, setOperator] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+229");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      {/* HEADER RESPONSIVE */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
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

      {/* FORMULAIRE AVEC GLASSMORPHISM */}
      <BlurView 
        intensity={100} 
        tint="dark" 
        style={[
          styles.blurContainer,
          paymentMode === "momo" && styles.blurContainerMomo
        ]}
      >
        <View style={styles.glassOverlay} />

        {/* INDICATEUR CENTRÉ UNIQUE */}
        <View style={styles.topIndicatorContainer}>
          <View style={styles.topIndicator} />
        </View>

        {/* TABS DE SÉLECTION - BLOC UNI */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsBlock}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                styles.tabButtonLeft,
                paymentMode === "card" && styles.tabButtonActive,
              ]}
              onPress={() => setPaymentMode("card")}
            >
              <Text style={styles.tabText}>Payer par carte</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabButton,
                styles.tabButtonRight,
                paymentMode === "momo" && styles.tabButtonActive,
              ]}
              onPress={() => setPaymentMode("momo")}
            >
              <Text style={styles.tabText}>Payer par Momo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CONTENU DU FORMULAIRE */}
        <View style={styles.contentContainer}>
          {paymentMode === "card" ? (
            // FORMULAIRE CARTE
            <View style={styles.formInner}>
              {/* Numéro de carte avec VISA */}
              <Text style={styles.label}>Numéro de carte</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="1234 1234 1234 1234"
                  placeholderTextColor="#6B6A7F"
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  keyboardType="numeric"
                />
                <Image
                  source={require("@/assets/images/visa.png")}
                  style={styles.visaIcon}
                  resizeMode="contain"
                />
              </View>

              {/* Date d'expiration et Code de sécurité - CÔTE À CÔTE */}
              <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Date d&apos;expiration</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM / AA"
                    placeholderTextColor="#6B6A7F"
                    value={expiryDate}
                    onChangeText={setExpiryDate}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Code de sécurité</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="CVC"
                      placeholderTextColor="#6B6A7F"
                      value={securityCode}
                      onChangeText={setSecurityCode}
                      keyboardType="numeric"
                      maxLength={3}
                    />
                    <CreditCard
                      size={20}
                      color="#6B6A7F"
                      style={styles.iconRight}
                    />
                  </View>
                </View>
              </View>

              {/* Nom du titulaire de la carte */}
              <Text style={styles.label}>Nom du titulaire de la carte</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe More"
                placeholderTextColor="#6B6A7F"
                value={cardholderName}
                onChangeText={setCardholderName}
              />

              {/* Pays avec dropdown */}
              <Text style={styles.label}>Pays</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Bénin"
                  placeholderTextColor="#6B6A7F"
                  value={country}
                  onChangeText={setCountry}
                />
                <ChevronDown
                  size={20}
                  color="#FFFFFF"
                  style={styles.iconRight}
                />
              </View>

              {/* Ligne adresse 1 */}
              <Text style={styles.label}>Ligne adresse 1</Text>
              <TextInput
                style={styles.input}
                placeholder="Rue 12"
                placeholderTextColor="#6B6A7F"
                value={addressLine1}
                onChangeText={setAddressLine1}
              />

              {/* État */}
              <Text style={styles.label}>État</Text>
              <TextInput
                style={styles.input}
                placeholder="Cotonou"
                placeholderTextColor="#6B6A7F"
                value={state}
                onChangeText={setState}
              />

              {/* Ville et Code postal - CÔTE À CÔTE */}
              <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Ville</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Cotonou"
                    placeholderTextColor="#6B6A7F"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Code postal</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="02BP42"
                    placeholderTextColor="#6B6A7F"
                    value={postalCode}
                    onChangeText={setPostalCode}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          ) : (
            // FORMULAIRE MOMO
            <View style={styles.formInner}>
              {/* Opérateur avec dropdown */}
              <Text style={styles.label}>Opérateur</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="MTN / Moov"
                  placeholderTextColor="#6B6A7F"
                  value={operator}
                  onChangeText={setOperator}
                />
                <ChevronDown
                  size={20}
                  color="#FFFFFF"
                  style={styles.iconRight}
                />
              </View>

              {/* Numéro avec pays et MTN */}
              <Text style={styles.label}>Numéro</Text>
              <View style={styles.inputWrapper}>
                <View style={styles.phoneInputContainer}>
                  <Image
                    source={require("@/assets/images/pays.png")}
                    style={styles.paysIcon}
                    resizeMode="contain"
                  />
                  <TouchableOpacity style={styles.countryCodeSelector}>
                    <Text style={styles.countryCodeText}>{countryCode}</Text>
                    <ChevronDown size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="XX XX XX XX"
                    placeholderTextColor="#6B6A7F"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                  />
                </View>
                <Image
                  source={require("@/assets/images/mtn.png")}
                  style={styles.mtnIcon}
                  resizeMode="contain"
                />
              </View>

              {/* Nom et Prénom - CÔTE À CÔTE */}
              <View style={styles.rowContainer}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Nom</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Doe"
                    placeholderTextColor="#6B6A7F"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Prénom</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="John"
                    placeholderTextColor="#6B6A7F"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
              </View>

              {/* Email */}
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="john.doe@example.com"
                placeholderTextColor="#6B6A7F"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          )}
        </View>

        {/* BOUTON DE PAIEMENT - TOUJOURS EN BAS */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>
              PAYER {totalPrice.toLocaleString()} F CFA
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
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

  imageBackground: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.35,
    position: "absolute",
    top: 0,
  },

  blurContainer: {
    position: "absolute",
    bottom: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.85,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },

  blurContainerMomo: {
    height: SCREEN_HEIGHT * 0.65,
  },

  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(38, 37, 59, 0.25)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  topIndicatorContainer: {
    width: "100%",
    height: 4,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  topIndicator: {
    width: 50.7,
    height: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },

  tabsContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingTop: 12,
    paddingBottom: 15,
  },

  tabsBlock: {
    flexDirection: "row",
    height: 52.5,
    borderRadius: 10,
    overflow: "hidden",
  },

  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },

  tabButtonLeft: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  tabButtonRight: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },

  tabButtonActive: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
  },

  tabText: {
    fontFamily: "KumbhSans_700Bold",
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 14,
    textAlign: "center",
  },

  contentContainer: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
  },

  formInner: {
    // Le contenu prend juste l'espace nécessaire
  },

  label: {
    fontFamily: "KumbhSans_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
    marginBottom: 6,
    marginTop: 10,
    lineHeight: 13,
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: 4,
  },

  input: {
    width: "100%",
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontFamily: "KumbhSans_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
    lineHeight: 13,
  },

  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 10,
    paddingLeft: 12,
  },

  paysIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },

  countryCodeSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: "rgba(255, 255, 255, 0.2)",
    marginRight: 12,
  },

  countryCodeText: {
    fontFamily: "KumbhSans_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
    marginRight: 4,
  },

  phoneInput: {
    flex: 1,
    height: 48,
    fontFamily: "KumbhSans_700Bold",
    fontSize: 13,
    color: "#FFFFFF",
    lineHeight: 13,
  },

  mtnIcon: {
    position: "absolute",
    right: 16,
    top: 12,
    width: 50,
    height: 24,
  },

  visaIcon: {
    position: "absolute",
    right: 16,
    top: 10,
    width: 90,
    height: 24,
  },

  iconRight: {
    position: "absolute",
    right: 16,
    top: 14,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  halfWidth: {
    flex: 1,
  },

  buttonContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingBottom: 20,
    paddingTop: 15,
  },

  payButton: {
    width: "100%",
    height: 52.5,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  payButtonText: {
    fontFamily: "KumbhSans_700Bold",
    fontSize: 14,
    color: "#18172A",
    textAlign: "center",
    lineHeight: 14,
  },
});