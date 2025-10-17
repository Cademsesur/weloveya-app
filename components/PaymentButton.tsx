import { useKkiapay, IData } from '@kkiapay-org/react-native-sdk';
import { useCallback, useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/services/contexts/ThemeContext';

interface PaymentButtonProps {
  amount: number;
  email: string;
  phone: string;
  onSuccess?: (data: any) => void;
  onFailure?: (error: any) => void;
  buttonText?: string;
  disabled?: boolean;
  loading?: boolean;
  buttonStyle?: any; // Style personnalisé pour le bouton
  buttonTextStyle?: any; // Style personnalisé pour le texte du bouton
}

export default function PaymentButton({
  amount,
  email,
  phone,
  onSuccess,
  onFailure,
  buttonText = "Payer maintenant",
  disabled = false,
  loading = false,
  buttonStyle = {},
  buttonTextStyle = {}
}: PaymentButtonProps) {
  const { openKkiapayWidget, addSuccessListener, addFailedListener } = useKkiapay();
  const { theme } = useTheme();

  // Gestion des callbacks avec useCallback pour éviter les boucles infinies
  const handleSuccess = useCallback((data: any) => {
    console.log('Paiement réussi:', data);
    if (onSuccess) onSuccess(data);
  }, [onSuccess]);

  const handleFailure = useCallback((error: any) => {
    console.log('Échec du paiement:', error);
    if (onFailure) onFailure(error);
  }, [onFailure]);

  useEffect(() => {
    // S'abonner aux événements de paiement
    addSuccessListener(handleSuccess);
    addFailedListener(handleFailure);
    
    // Note: KKiaPay gère automatiquement le nettoyage des écouteurs
    // Aucun nettoyage explicite nécessaire selon la documentation
  }, [addSuccessListener, addFailedListener, handleSuccess, handleFailure]);

  const handlePayment = () => {
    if (amount <= 0 || disabled || loading) return;
    
    // Préparer les données de paiement selon l'interface IData attendue par KKiaPay
    const paymentData: IData = {
      amount: Math.round(amount),
      api_key: "098353c0a91e11f08842790870fe23ea",
      sandbox: true, // À remplacer par false en production
      email,
      phone,
      reason: `Paiement de ${Math.round(amount)} FCFA`, // Raison du paiement
      data: JSON.stringify({
        // Vous pouvez ajouter des données supplémentaires ici
        reference: `PAY-${Date.now()}`,
        items: [
          {
            name: 'Billet',
            quantity: 1,
            unit_price: Math.round(amount),
            total_price: Math.round(amount)
          }
        ]
      })
    };
    
    openKkiapayWidget(paymentData);
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { 
          backgroundColor: disabled ? theme.textTertiary : theme.primary,
          opacity: disabled ? 0.7 : 1,
          ...buttonStyle // Applique le style personnalisé
        }
      ]} 
      onPress={handlePayment}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={[
          styles.buttonText, 
          buttonTextStyle,
          buttonStyle?.color && { color: buttonStyle.color }
        ]}>
          {buttonText}
        </Text>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 200,
    backgroundColor: '#18172A',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
