import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as ImagePicker from 'expo-image-picker';
import { dataStore } from '@/lib/data-store';
import { recognizeFoodFromImage } from '@/lib/google-vision';


// Mock food database for demo
const MOCK_FOODS = [
  { name: 'Курица с рисом', calories: 450, protein: 35, fat: 12, carbs: 45 },
  { name: 'Паста Болоньезе', calories: 520, protein: 28, fat: 18, carbs: 62 },
  { name: 'Салат Цезарь', calories: 380, protein: 22, fat: 20, carbs: 28 },
  { name: 'Пицца Маргарита', calories: 680, protein: 25, fat: 28, carbs: 78 },
  { name: 'Стейк с овощами', calories: 620, protein: 48, fat: 32, carbs: 18 },
  { name: 'Омлет с беконом', calories: 420, protein: 32, fat: 28, carbs: 8 },
  { name: 'Суши ролл', calories: 280, protein: 12, fat: 8, carbs: 42 },
  { name: 'Бургер', calories: 580, protein: 28, fat: 32, carbs: 52 },
];

export default function CameraScreen() {
  const colors = useColors();
  const tr = useTranslation();
  const router = useRouter();

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recognizedFood, setRecognizedFood] = useState<typeof MOCK_FOODS[0] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleAnalyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Ошибка', 'Не удалось открыть камеру');
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleAnalyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Ошибка', 'Не удалось открыть галерею');
    }
  };

  const handleAnalyzeImage = async (imageUri: string) => {
    setIsAnalyzing(true);
    try {
      // Use Google Vision API for food recognition
      const result = await recognizeFoodFromImage(imageUri);
      if (result) {
        setRecognizedFood(result);
        setShowResults(true);
        setSelectedImage(imageUri);
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Ошибка', 'Не удалось проанализировать изображение');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToDiary = async () => {
    if (recognizedFood) {
      try {
        await dataStore.addMeal({
          name: recognizedFood.name,
          calories: recognizedFood.calories,
          protein: recognizedFood.protein,
          fat: recognizedFood.fat,
          carbs: recognizedFood.carbs,
          date: new Date().toISOString().split('T')[0],
        });
        
        Alert.alert('Успешно', `${recognizedFood.name} добавлено в дневник`, [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } catch (error) {
        Alert.alert('Ошибка', 'Не удалось добавить блюдо в дневник');
      }
    }
  };

  const handleReset = () => {
    setShowResults(false);
    setRecognizedFood(null);
    setSelectedImage(null);
    setIsAnalyzing(false);
  };

  if (showResults && recognizedFood) {
    return (
      <ScreenContainer className="p-4">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
          <View className="gap-4">
            {/* Header */}
            <View className="gap-2">
              <Text className="text-3xl font-bold text-foreground">Результаты анализа</Text>
            </View>

            {/* Image Preview */}
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
                style={{ width: '100%', height: 250, borderRadius: 16 }}
                resizeMode="cover"
              />
            )}

            {/* Food Info Card */}
            <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
              <View className="gap-2">
                <Text className="text-sm text-muted font-semibold">Распознано блюдо</Text>
                <Text className="text-2xl font-bold text-foreground">{recognizedFood.name}</Text>
              </View>

              {/* Macros */}
              <View className="gap-3">
                <View className="flex-row items-center justify-between py-3 border-b border-border">
                  <Text className="text-base text-muted">Калории</Text>
                  <Text className="text-2xl font-bold text-primary">{recognizedFood.calories}</Text>
                </View>
                <View className="flex-row gap-3">
                  <View className="flex-1 bg-background rounded-lg p-3 items-center">
                    <Text className="text-xs text-muted mb-1">Белки</Text>
                    <Text className="text-lg font-bold text-foreground">{recognizedFood.protein}г</Text>
                  </View>
                  <View className="flex-1 bg-background rounded-lg p-3 items-center">
                    <Text className="text-xs text-muted mb-1">Жиры</Text>
                    <Text className="text-lg font-bold text-foreground">{recognizedFood.fat}г</Text>
                  </View>
                  <View className="flex-1 bg-background rounded-lg p-3 items-center">
                    <Text className="text-xs text-muted mb-1">Углеводы</Text>
                    <Text className="text-lg font-bold text-foreground">{recognizedFood.carbs}г</Text>
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="gap-3 mt-4">
                <TouchableOpacity
                  onPress={handleAddToDiary}
                  className="bg-primary rounded-lg py-4 items-center active:opacity-80"
                >
                  <Text className="text-white font-semibold text-base">Добавить в дневник</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleReset}
                  className="bg-surface border border-border rounded-lg py-4 items-center active:opacity-70"
                >
                  <Text className="text-foreground font-semibold text-base">Попробовать ещё</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (isAnalyzing) {
    return (
      <ScreenContainer className="items-center justify-center">
        <View className="gap-4 items-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="text-lg font-semibold text-foreground">Анализирую фото...</Text>
          <Text className="text-sm text-muted">Это займёт несколько секунд</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 flex-1 justify-center">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Добавить еду</Text>
            <Text className="text-base text-muted">Сфотографируйте блюдо или выберите из галереи</Text>
          </View>

          {/* Illustration */}
          <View className="items-center justify-center py-8">
            <View className="w-32 h-32 rounded-full bg-primary opacity-10 items-center justify-center">
              <IconSymbol name="camera.fill" size={64} color={colors.primary} />
            </View>
          </View>

          {/* Buttons */}
          <View className="gap-3">
            {/* Take Photo Button */}
            <TouchableOpacity
              onPress={handleTakePhoto}
              className="bg-primary rounded-2xl py-6 flex-row items-center justify-center gap-3 active:opacity-80"
            >
              <IconSymbol name="camera.fill" size={24} color="white" />
              <Text className="text-white font-semibold text-lg">Сфотографировать</Text>
            </TouchableOpacity>

            {/* Select from Gallery Button */}
            <TouchableOpacity
              onPress={handleSelectFromGallery}
              className="bg-surface border-2 border-primary rounded-2xl py-6 flex-row items-center justify-center gap-3 active:opacity-70"
            >
              <IconSymbol name="photo.fill" size={24} color={colors.primary} />
              <Text className="text-primary font-semibold text-lg">Выбрать из галереи</Text>
            </TouchableOpacity>
          </View>

          {/* Info */}
          <View className="bg-surface rounded-xl p-4 gap-2">
            <View className="flex-row gap-2 items-start">
              <IconSymbol name="info.circle.fill" size={20} color={colors.primary} />
              <Text className="text-sm text-muted flex-1">
                Наш ИИ проанализирует фото и определит калории и макронутриенты блюда
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
