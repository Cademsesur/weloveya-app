import { useFonts } from 'expo-font';
import {
  KumbhSans_400Regular,
  KumbhSans_500Medium,
  KumbhSans_600SemiBold,
  KumbhSans_700Bold,
  KumbhSans_800ExtraBold,
} from '@expo-google-fonts/kumbh-sans';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/services/contexts/ThemeContext';

export function FontLoader({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [fontsLoaded] = useFonts({
    KumbhSans_400Regular,
    KumbhSans_500Medium,
    KumbhSans_600SemiBold,
    KumbhSans_700Bold,
    KumbhSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: theme.background 
      }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return <>{children}</>;
}
