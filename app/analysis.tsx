import { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useTranslation } from '@/hooks/use-translation';
import { useColors } from '@/hooks/use-colors';
import { dataStore, type Meal } from '@/lib/data-store';

interface FoodAnalysis {
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  servingSize: string;
}

export default function AnalysisScreen() {
  const tr = useTranslation();
  const colors = useColors();
  const router = useRouter();
  const { photoUri, photoBase64 } = useLocalSearchParams();
  
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [servingMultiplier, setServingMultiplier] = useState(1);

  useEffect(() => {
    analyzeFoodImage();
  }, []);

  const analyzeFoodImage = async () => {
    try {
      setLoading(true);
      
      // Mock AI analysis - in production, this would call your backend LLM
      // For now, we'll simulate a response
      const mockAnalysis: FoodAnalysis = {
        name: 'Куриная грудка с рисом',
        calories: 350,
        protein: 45,
        fat: 8,
        carbs: 25,
        servingSize: '200g',
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Failed to analyze food:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async () => {
    if (!analysis) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const meal: Omit<Meal, 'id'> = {
        name: analysis.name,
        calories: Math.round(analysis.calories * servingMultiplier),
        protein: Math.round(analysis.protein * servingMultiplier),
        fat: Math.round(analysis.fat * servingMultiplier),
        carbs: Math.round(analysis.carbs * servingMultiplier),
        date: today,
        imageUrl: photoUri as string,
      };

      await dataStore.addMeal(meal);
      router.push('/(tabs)');
    } catch (error) {
      console.error('Failed to add meal:', error);
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-primary font-semibold">{tr('back')}</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-foreground">{tr('analyzing')}</Text>
            <View className="w-12" />
          </View>

          {/* Food Image */}
          {photoUri && (
            <Image
              source={{ uri: photoUri as string }}
              className="w-full h-64 rounded-2xl bg-surface"
            />
          )}

          {loading ? (
            <View className="h-64 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary} />
              <Text className="text-muted mt-4">{tr('analyzing')}</Text>
            </View>
          ) : analysis ? (
            <>
              {/* Food Name */}
              <View className="bg-surface rounded-2xl p-6 border border-border gap-2">
                <Text className="text-sm text-muted">{tr('foodName')}</Text>
                <Text className="text-2xl font-bold text-foreground">{analysis.name}</Text>
              </View>

              {/* Calories */}
              <View className="bg-primary rounded-2xl p-6 gap-2">
                <Text className="text-sm text-white/80">{tr('calories_')}</Text>
                <View className="flex-row items-baseline gap-2">
                  <Text className="text-4xl font-bold text-white">
                    {Math.round(analysis.calories * servingMultiplier)}
                  </Text>
                  <Text className="text-white">{tr('grams')}</Text>
                </View>
              </View>

              {/* Macros */}
              <View className="flex-row gap-3">
                <View className="flex-1 bg-surface rounded-xl p-4 border border-border gap-1 items-center">
                  <Text className="text-xs text-muted">{tr('protein')}</Text>
                  <Text className="text-2xl font-bold text-foreground">
                    {Math.round(analysis.protein * servingMultiplier)}
                  </Text>
                  <Text className="text-xs text-muted">{tr('grams')}</Text>
                </View>
                <View className="flex-1 bg-surface rounded-xl p-4 border border-border gap-1 items-center">
                  <Text className="text-xs text-muted">{tr('fat')}</Text>
                  <Text className="text-2xl font-bold text-foreground">
                    {Math.round(analysis.fat * servingMultiplier)}
                  </Text>
                  <Text className="text-xs text-muted">{tr('grams')}</Text>
                </View>
                <View className="flex-1 bg-surface rounded-xl p-4 border border-border gap-1 items-center">
                  <Text className="text-xs text-muted">{tr('carbs')}</Text>
                  <Text className="text-2xl font-bold text-foreground">
                    {Math.round(analysis.carbs * servingMultiplier)}
                  </Text>
                  <Text className="text-xs text-muted">{tr('grams')}</Text>
                </View>
              </View>

              {/* Serving Size Adjustment */}
              <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-semibold text-foreground">{tr('servingSize')}</Text>
                  <Text className="text-lg font-bold text-primary">
                    {(servingMultiplier * 100).toFixed(0)}%
                  </Text>
                </View>
                <View className="flex-row items-center gap-4">
                  <TouchableOpacity
                    onPress={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.25))}
                    className="bg-primary rounded-full w-12 h-12 items-center justify-center"
                  >
                    <Text className="text-white text-xl font-bold">−</Text>
                  </TouchableOpacity>
                  <View className="flex-1 h-2 bg-background rounded-full">
                    <View
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${servingMultiplier * 100}%` }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => setServingMultiplier(Math.min(2, servingMultiplier + 0.25))}
                    className="bg-primary rounded-full w-12 h-12 items-center justify-center"
                  >
                    <Text className="text-white text-xl font-bold">+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Add Button */}
              <TouchableOpacity
                onPress={handleAddMeal}
                className="bg-accent rounded-full py-4 items-center justify-center mt-4"
              >
                <Text className="text-white font-semibold text-base">{tr('addToDiary')}</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
