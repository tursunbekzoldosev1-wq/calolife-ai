import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useTranslation } from "@/hooks/use-translation";
import { useColors } from "@/hooks/use-colors";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { dataStore, type Meal } from "@/lib/data-store";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";

export default function DiaryScreen() {
  const tr = useTranslation();
  const colors = useColors();
  const router = useRouter();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [stats, setStats] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0 });

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const todayMeals = await dataStore.getTodayMeals();
    const todayStats = await dataStore.getTodayStats();
    setMeals(todayMeals);
    setStats(todayStats);
  };

  const handleDelete = async (id: string) => {
    await dataStore.deleteMeal(id);
    loadData();
  };

  const mealCategories = [
    { key: 'breakfast', label: 'Завтрак', icon: 'sunrise.fill' as const },
    { key: 'lunch', label: 'Обед', icon: 'sun.max.fill' as const },
    { key: 'dinner', label: 'Ужин', icon: 'moon.fill' as const },
    { key: 'snacks', label: 'Перекусы', icon: 'star.fill' as const },
  ];

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">{tr('diary')}</Text>
            <Text className="text-sm text-muted">{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          </View>

          {/* Daily Summary */}
          <View className="bg-surface rounded-2xl p-5 gap-4 border border-border">
            <Text className="text-base font-semibold text-foreground">Итого за день</Text>
            <View className="flex-row items-center justify-between">
              <View className="items-center gap-1">
                <Text className="text-3xl font-bold text-primary">{stats.calories}</Text>
                <Text className="text-xs text-muted">ккал</Text>
              </View>
              <View className="flex-row gap-4">
                <View className="items-center gap-1">
                  <Text className="text-lg font-bold text-foreground">{stats.protein}г</Text>
                  <Text className="text-xs text-muted">Белки</Text>
                </View>
                <View className="items-center gap-1">
                  <Text className="text-lg font-bold text-foreground">{stats.fat}г</Text>
                  <Text className="text-xs text-muted">Жиры</Text>
                </View>
                <View className="items-center gap-1">
                  <Text className="text-lg font-bold text-foreground">{stats.carbs}г</Text>
                  <Text className="text-xs text-muted">Углеводы</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Meals List */}
          {meals.length === 0 ? (
            <View className="bg-surface rounded-xl p-8 border border-border items-center gap-3">
              <Text className="text-4xl">🍽️</Text>
              <Text className="text-muted text-base text-center">Нет приёмов пищи сегодня</Text>
              <Text className="text-sm text-muted text-center">Нажмите кнопку камеры на главном экране чтобы добавить блюдо</Text>
            </View>
          ) : (
            <View className="gap-2">
              <Text className="text-base font-semibold text-foreground">Приёмы пищи ({meals.length})</Text>
              {meals.map((meal) => (
                <View
                  key={meal.id}
                  className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between"
                >
                  <View className="flex-1 gap-1">
                    <Text className="text-base font-semibold text-foreground">{meal.name}</Text>
                    <Text className="text-sm text-muted">
                      {meal.calories} ккал · {meal.protein}г белок · {meal.fat}г жиры · {meal.carbs}г углеводы
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDelete(meal.id)}
                    className="p-2 ml-2"
                    activeOpacity={0.7}
                  >
                    <IconSymbol name="trash" size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Add Food Button */}
          <TouchableOpacity
            onPress={() => router.push('/camera')}
            className="bg-primary rounded-full py-4 items-center justify-center mt-2"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">+ Добавить блюдо</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
