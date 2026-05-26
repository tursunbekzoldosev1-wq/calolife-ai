import { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/use-colors';

const { height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const colors = useColors();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animate entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to home after 3 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, fadeAnim, scaleAnim, translateYAnim]);

  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.background }}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        }}
        className="items-center gap-6"
      >
        {/* Logo */}
        <Image
          source={require('@/assets/images/icon.png')}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />

        {/* App Name */}
        <View className="items-center gap-2">
          <Text className="text-4xl font-bold text-foreground">CaloLife</Text>
          <Text className="text-base text-muted text-center px-4">
            Ваш персональный помощник по здоровому питанию
          </Text>
        </View>

        {/* Loading indicator */}
        <View className="mt-8 gap-2">
          <View className="flex-row gap-1 items-center justify-center">
            <View className="w-2 h-2 rounded-full bg-primary" />
            <View className="w-2 h-2 rounded-full bg-primary opacity-60" />
            <View className="w-2 h-2 rounded-full bg-primary opacity-30" />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
