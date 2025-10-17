import CheckoutBottomSheet from "@/components/CheckoutBottomSheet";
import api, { EventDetail, PassType } from "@/services/api";
import { useTheme } from "@/services/contexts/ThemeContext";
import {
  KumbhSans_400Regular,
  KumbhSans_500Medium,
  KumbhSans_600SemiBold,
  KumbhSans_700Bold,
} from '@expo-google-fonts/kumbh-sans';
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Calendar, ChevronLeft, Minus, Plus, Share } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const BASE_URL = 'https://attendee-api.eyawle.sesur.bj/api';

interface PaymentResponse {
  transactionId: string;
  data?: string;
  [key: string]: any; // Allow additional properties
}

interface PaymentRequest {
  phone_number: string;
  name: string;
  email: string;
  payment_method: string;
  amount: number;
  pass_type_id: number;
  qte: number;
}

export default function TendancesPage() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [fontsLoaded] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
    KumbhSans_600SemiBold,
    KumbhSans_700Bold,
  });
  
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [passTypes, setPassTypes] = useState<PassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<PassType | null>(null);
  const [count, setCount] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  
  const eventId = params.id as string;

  const fetchEventDetails = useCallback(async () => {
    if (!fontsLoaded) return;
    
    try {
      setLoading(true);
      console.log('Chargement de l\'événement avec ID:', eventId);
      
      if (!eventId) {
        throw new Error('Aucun identifiant d\'événement fourni');
      }
      
      let eventData;
      
      try {
        const eventResponse = await api.getEvent(parseInt(eventId));
        if (eventResponse.data) {
          console.log('Événement trouvé via getEvent:', eventResponse.data);
          eventData = eventResponse.data;
        }
      } catch (getEventError) {
        console.log('Erreur avec getEvent, tentative avec getAllEvents...', getEventError);
      }
      
      if (!eventData) {
        const allEventsResponse = await api.getAllEvents();
        const foundEvent = allEventsResponse.data.find((e: any) => e.id === parseInt(eventId));
        
        if (!foundEvent) {
          throw new Error('Événement non trouvé');
        }
        
        console.log('Événement trouvé via getAllEvents:', foundEvent);
        eventData = foundEvent;
      }
      
      setEvent(eventData);
      setPassTypes(eventData.pass_types || []);
      
    } catch (error) {
      console.error('Erreur lors du chargement de l\'événement:', error);
      
      Alert.alert(
        'Événement introuvable',
        'L\'événement que vous recherchez n\'existe pas ou n\'est plus disponible.',
        [
          {
            text: 'Retour',
            onPress: () => router.back()
          }
        ]
      );
      
      setTimeout(() => {
        router.back();
      }, 2000);
      
    } finally {
      setLoading(false);
    }
  }, [eventId, fontsLoaded, router]);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;
      await fetchEventDetails();
    };
    loadEvent();
  }, [eventId, fetchEventDetails]);

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

  const totalPrice = selectedTicket ? parseFloat(selectedTicket.price.toString()) * count : 0;

  const styles = StyleSheet.create({
    container: { 
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    imageBackground: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT * 0.4,
      justifyContent: 'flex-start',
      alignItems: 'center',
      overflow: 'hidden',
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? insets.top + 10 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    headerButton: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer: {
      backgroundColor: theme.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: -24,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: Platform.OS === 'ios' ? insets.bottom + 16 : 16,
      flex: 1,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 8,
      fontFamily: 'KumbhSans_700Bold',
      lineHeight: 28,
    },
    description: {
      fontSize: 14,
      color: theme.text + 'CC',
      marginBottom: 12,
      lineHeight: 20,
      fontFamily: 'KumbhSans_400Regular',
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    infoText: {
      marginLeft: 8,
      fontSize: 14,
      color: theme.text,
      fontFamily: 'KumbhSans_500Medium',
      flex: 1,
    },
    separator: {
      height: 1,
      backgroundColor: theme.isDark ? '#3A394F' : '#E5E5E5',
      marginVertical: 12,
    },
    date: {
      marginLeft: 8,
      fontSize: 14,
      color: theme.text,
      fontFamily: 'KumbhSans_600SemiBold',
    },
    sectionTitle: {
      fontSize: 18,
      color: theme.text,
      fontFamily: 'KumbhSans_700Bold',
      marginBottom: 12,
      marginTop: 4,
    },
    buttonScrollView: {
      minHeight: 90, // Hauteur minimale pour éviter les sauts de mise en page
      marginBottom: 0, // On gère l'espacement avec le conteneur parent
    },
    buttonScrollContent: {
      paddingRight: 20,
      paddingBottom: 8, // Ajout d'un peu d'espace en bas des boutons
    },
    ticketButton: {
      minWidth: SCREEN_WIDTH * 0.38,
      maxHeight: 70,
      backgroundColor: theme.isDark ? '#2A2940' : '#FFFFFF',
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 14,
      marginRight: 10,
      borderWidth: 2,
      borderColor: 'transparent',
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeTicketButton: {
      borderColor: theme.primary,
      backgroundColor: theme.isDark ? '#2A2940' : '#FFFFFF',
      ...Platform.select({
        ios: {
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 2,
        },
      }),
    },
    ticketButtonText: {
      fontSize: 15,
      color: theme.isDark ? theme.text : '#18172A',
      fontFamily: 'KumbhSans_600SemiBold',
      marginBottom: 4,
    },
    activeTicketButtonText: {
      color: theme.primary,
      fontFamily: 'KumbhSans_700Bold',
    },
    ticketPrice: {
      fontSize: 13,
      color: theme.isDark ? theme.text + 'AA' : '#18172A',
      fontFamily: 'KumbhSans_600SemiBold',
    },
    activeTicketPrice: {
      color: theme.primary,
      fontFamily: 'KumbhSans_700Bold',
    },
    counterContainer: {
      marginTop: 24,
      marginBottom: 16,
      alignItems: 'center',
    },
    counterLayout: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 50,
      paddingHorizontal: 6,
      paddingVertical: 6,
      minWidth: 140,
    },
    counterButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.isDark ? '#FFFFFF' : theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
        },
        android: {
          elevation: 0,
        },
      }),
    },
    counterButtonDisabled: {
      backgroundColor: 'transparent',
      borderColor: theme.isDark ? '#3A394F' : '#D1D1D1',
      opacity: 0.5,
    },
    counterNumber: {
      fontSize: 18,
      fontFamily: 'KumbhSans_700Bold',
      color: theme.text,
      minWidth: 36,
      textAlign: 'center',
    },
    buttonContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
      paddingTop: 5,
      backgroundColor: theme.background,
      marginTop: -10,
    },
    payButton: {
      width: '100%',
      height: 52.5,
      backgroundColor: theme.primary,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    payButtonDisabled: {
      backgroundColor: theme.isDark ? '#3A394F' : '#E5E5E5',
      opacity: 0.7,
    },
    payButtonText: {
      fontFamily: 'KumbhSans_700Bold',
      fontSize: 14,
      color: theme.primaryText || (theme.isDark ? '#18172A' : '#FFFFFF'),
      textAlign: 'center',
      lineHeight: 14,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.background,
    },
    emptyText: {
      fontSize: 16,
      color: theme.text + '99',
      fontFamily: 'KumbhSans_500Medium',
      textAlign: 'center',
      marginTop: 8,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }
  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={[styles.emptyText, { fontFamily: 'KumbhSans_700Bold' }]}>
          Événement introuvable
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor="transparent" 
        translucent 
      />
      
      {/* IMAGE DE FOND */}
      <ImageBackground
        source={event.banner_url ? { uri: event.banner_url } : require("@/assets/images/Asake.png")}
        style={styles.imageBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={theme.isDark
            ? ["rgba(0,0,0,0.3)", "rgba(24,23,42,0.7)", theme.background]
            : ["rgba(245,246,247,0.2)", "rgba(245,246,247,0.6)", theme.background]
          }
          style={StyleSheet.absoluteFillObject}
        />
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronLeft width={28} height={28} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            activeOpacity={0.7}
          >
            <Share width={24} height={24} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* CONTENU */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{event.name}</Text>

        {event.description && (
          <Text style={styles.description} numberOfLines={2}>
            {event.description}
          </Text>
        )}

        {event.location && (
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={20} color={theme.primary} />
            <Text style={styles.infoText} numberOfLines={1}>{event.location}</Text>
          </View>
        )}

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <Calendar size={20} color={theme.primary} />
          <Text style={styles.date}>
            {formatDate(event.start_date, event.end_date)}
          </Text>
        </View>

        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>Billets disponibles</Text>

        {passTypes.length > 0 ? (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.buttonScrollContent}
              style={styles.buttonScrollView}
            >
              {passTypes.map((passType) => {
                const isActive = selectedTicket?.id === passType.id;
                return (
                  <TouchableOpacity
                    key={passType.id}
                    activeOpacity={0.7}
                    style={[
                      styles.ticketButton,
                      isActive && styles.activeTicketButton,
                    ]}
                    onPress={() => setSelectedTicket(isActive ? null : passType)}
                  >
                    <Text style={[
                      styles.ticketButtonText,
                      isActive && styles.activeTicketButtonText
                    ]}>
                      {passType.name}
                    </Text>
                    <Text style={[
                      styles.ticketPrice,
                      isActive && styles.activeTicketPrice
                    ]}>
                      {Math.round(parseFloat(passType.price.toString())).toLocaleString('fr-FR')} FCFA
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* COMPTEUR */}
            <View style={styles.counterContainer}>
              <View style={styles.counterLayout}>
                <TouchableOpacity
                  style={[
                    styles.counterButton,
                    count === 1 && styles.counterButtonDisabled
                  ]}
                  onPress={() => setCount(count > 1 ? count - 1 : 1)}
                  disabled={count === 1}
                  activeOpacity={0.7}
                >
                  <Minus size={18} color={theme.isDark ? '#FFFFFF' : theme.primary} />
                </TouchableOpacity>

                <Text style={styles.counterNumber}>{count}</Text>

                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => setCount(count + 1)}
                  activeOpacity={0.7}
                >
                  <Plus size={18} color={theme.isDark ? '#FFFFFF' : theme.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* BOUTON POUR OUVRIR LE BOTTOM SHEET DE PAIEMENT */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[
                  styles.payButton, 
                  (!selectedTicket || isPaying) && styles.payButtonDisabled
                ]} 
                onPress={() => setShowCheckout(true)}
                disabled={!selectedTicket || isPaying}
              >
                {isPaying ? (
                  <ActivityIndicator color={theme.primaryText} />
                ) : (
                  <Text style={styles.payButtonText}>
                    {selectedTicket 
                      ? `Payer ${Math.round(totalPrice).toLocaleString('fr-FR')} FCFA`
                      : "Sélectionner un billet"
                    }
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>
            Aucun billet disponible pour le moment
          </Text>
        )}
      </View>

      {/* BOTTOM SHEET CHECKOUT */}
      <CheckoutBottomSheet
        visible={showCheckout}
        onClose={() => setShowCheckout(false)}
        totalPrice={totalPrice}
        ticketName={selectedTicket?.name || ""}
        count={count}
      />
    </View>
  );
}