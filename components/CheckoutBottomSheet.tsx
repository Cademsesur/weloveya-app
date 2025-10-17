import { BlurView } from "expo-blur";
import {
  ChevronDown,
  CreditCard,
} from "lucide-react-native";
import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/services/contexts/ThemeContext";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CountryPicker, { Country, CountryCode } from 'react-native-country-picker-modal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface CheckoutBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  totalPrice: number;
  ticketName: string;
  count: number;
  onPaymentSuccess?: (data: any) => void;
  onPaymentFailure?: (error: any) => void;
}

export default function CheckoutBottomSheet({
  visible,
  onClose,
  totalPrice,
  ticketName,
  count,
}: CheckoutBottomSheetProps) {
  const { theme } = useTheme();
  const [paymentMode, setPaymentMode] = useState<"card" | "momo">("card");

  // Animation du bottom sheet
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // États pour les inputs CARTE
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [country, setCountry] = useState<Country | null>({
    name: 'Bénin',
    cca2: 'BJ',
  } as Country);
  const [countryCode, setCountryCode] = useState<CountryCode>('BJ');
  const [addressLine1, setAddressLine1] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // États pour les inputs MOMO
  const [operator, setOperator] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [momoCountry, setMomoCountry] = useState<Country | null>({
    name: 'Bénin',
    cca2: 'BJ',
    callingCode: ['229'],
  } as Country);
  const [momoCountryCode, setMomoCountryCode] = useState<CountryCode>('BJ');

  // Gestion du swipe pour fermer
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          closeSheet();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    }
  }, [visible, translateY]);

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SCREEN_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!visible) return null;

  const styles = getStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeSheet}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.bottomSheetContainer,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <BlurView
            intensity={100}
            tint="dark"
            style={[
              styles.blurContainer,
              paymentMode === "momo" && styles.blurContainerMomo,
            ]}
          >
            <View style={styles.glassOverlay} />

            {/* INDICATEUR CENTRÉ - Zone draggable */}
            <View style={styles.topIndicatorContainer} {...panResponder.panHandlers}>
              <View style={styles.topIndicator} />
            </View>

            {/* TABS DE SÉLECTION */}
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
            <ScrollView
              style={styles.contentContainer}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
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

                  {/* Date d'expiration et Code de sécurité */}
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
                          color={theme.textSecondary}
                          style={styles.iconRight}
                        />
                      </View>
                    </View>
                  </View>

                  {/* Nom du titulaire */}
                  <Text style={styles.label}>Nom du titulaire de la carte</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="John Doe More"
                    placeholderTextColor="#6B6A7F"
                    value={cardholderName}
                    onChangeText={setCardholderName}
                  />

                  {/* Pays */}
                  <Text style={styles.label}>Pays</Text>
                  <View style={styles.countryPickerWrapper}>
                    <CountryPicker
                      withFilter
                      withFlag
                      withCallingCode
                      withEmoji
                      withAlphaFilter
                      withCountryNameButton
                      onSelect={(selectedCountry) => {
                        setCountry(selectedCountry);
                        setCountryCode(selectedCountry.cca2 as CountryCode);
                      }}
                      countryCode={countryCode}
                      containerButtonStyle={{
                        width: '100%',
                        height: '100%',
                        justifyContent: 'center',
                      }}
                      renderFlagButton={({ onOpen }) => (
                        <TouchableOpacity 
                          onPress={onOpen}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <Text style={{ 
                            color: theme.text,
                            fontFamily: 'KumbhSans_700Bold',
                            fontSize: 14,
                          }}>
                            {String(country?.name || 'Bénin')}
                          </Text>
                          <ChevronDown size={20} color={theme.text} />
                        </TouchableOpacity>
                      )}
                      theme={{
                        primaryColor: theme.primary,
                        primaryColorVariant: theme.primary,
                        backgroundColor: theme.background,
                        onBackgroundTextColor: theme.text,
                        fontSize: 16,
                        fontFamily: 'KumbhSans_400Regular',
                      }}
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

                  {/* Ville et Code postal */}
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
                  {/* Opérateur */}
                  <Text style={styles.label}>Opérateur</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="MTN / Moov"
                      placeholderTextColor="#6B6A7F"
                      value={operator}
                      onChangeText={setOperator}
                    />
                    <ChevronDown size={20} color={theme.text} style={styles.iconRight} />
                  </View>

                  {/* Numéro */}
                  <Text style={styles.label}>Numéro</Text>
                  <View style={styles.phoneInputContainer}>
                    <CountryPicker
                      withFilter
                      withCallingCode
                      withFlag
                      withEmoji
                      onSelect={(selectedCountry) => {
                        setMomoCountry(selectedCountry);
                        setMomoCountryCode(selectedCountry.cca2 as CountryCode);
                      }}
                      countryCode={momoCountryCode}
                      containerButtonStyle={{
                        marginRight: 12,
                      }}
                      renderFlagButton={({ onOpen }) => (
                        <TouchableOpacity 
                          onPress={onOpen}
                          style={styles.countryCodeSelector}
                        >
                          <Text style={styles.countryCodeText}>
                            {momoCountry?.callingCode?.[0] ? `+${momoCountry.callingCode[0]}` : '+229'}
                          </Text>
                          <ChevronDown size={16} color={theme.text} />
                        </TouchableOpacity>
                      )}
                      theme={{
                        primaryColor: theme.primary,
                        primaryColorVariant: theme.primary,
                        backgroundColor: theme.background,
                        onBackgroundTextColor: theme.text,
                        fontSize: 16,
                        fontFamily: 'KumbhSans_400Regular',
                      }}
                    />
                    <TextInput
                      style={styles.phoneInput}
                      placeholder="XX XX XX XX"
                      placeholderTextColor="#6B6A7F"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                    />
                  </View>

                  {/* Nom et Prénom */}
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
            </ScrollView>

            {/* BOUTON DE PAIEMENT */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.payButton} onPress={closeSheet}>
                <Text style={styles.payButtonText}>
                  PAYER {Math.round(totalPrice).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
  },
  bottomSheetContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.85,
  },
  blurContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
  },
  blurContainerMomo: {
    height: SCREEN_HEIGHT * 0.65,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.isDark ? "rgba(24, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  topIndicatorContainer: {
    width: "100%",
    height: 30,
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  topIndicator: {
    width: 50.7,
    height: 4,
    backgroundColor: theme.text,
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
    color: theme.text,
    lineHeight: 14,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingBottom: 100,
  },
  formInner: {},
  label: {
    fontFamily: "KumbhSans_700Bold",
    fontSize: 13,
    color: theme.text,
    marginBottom: 6,
    marginTop: 10,
    lineHeight: 13,
  },
  countryPickerWrapper: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.surface,
    justifyContent: 'center',
  },
  countryPickerButton: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: "KumbhSans_700Bold",
    fontSize: 14,
    color: theme.text,
    backgroundColor: theme.surface,
    borderWidth: 0,
  },
  inputWrapper: {
    position: 'relative',
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: theme.surface,
    borderRadius: 12,
    paddingLeft: 12,
    paddingRight: 12,
    borderWidth: 0,
  },
  paysIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  countryCodeSelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
    paddingLeft: 4,
    borderRightWidth: 1,
    borderRightColor: "rgba(255, 255, 255, 0.2)",
  },
  countryCodeText: {
    fontFamily: "KumbhSans_700Bold",
    fontSize: 13,
    color: theme.text,
    marginRight: 4,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    fontFamily: "KumbhSans_700Bold",
    fontSize: 14,
    color: theme.text,
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
    backgroundColor: theme.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  payButtonText: {
    fontFamily: "KumbhSans_700Bold",
    fontSize: 14,
    color: theme.primaryText,
    textAlign: "center",
    lineHeight: 14,
  },
});