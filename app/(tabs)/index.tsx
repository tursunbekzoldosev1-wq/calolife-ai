import { ScrollView, Text, View, TouchableOpacity, Pressable, FlatList } from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useTranslation } from "@/hooks/use-translation";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { dataStore, type Meal } from "@/lib/data-store";

export default function HomeScreen() {
  const tr = useTranslation();
  const colors = useColors();
  const router = useRouter();
  const [dailyCalories, setDailyCalories] = useState(0);
  const [dailyProtein, setDailyProtein] = useState(0);
  const [dailyFat, setDailyFat] = useState(0);
  const [dailyCarbs, setDailyCarbs] = useState(0);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [calorieGoal, setCalorieGoal] = useState(2000);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    const todayMeals = await dataStore.getTodayMeals();
    const stats = await dataStore.getTodayStats();
    const goal = await dataStore.getGoal();

    setMeals(todayMeals);
    setDailyCalories(stats.calories);
    setDailyProtein(stats.protein);
    setDailyFat(stats.fat);
    setDailyCarbs(stats.carbs);
    if (goal) {
      setCalorieGoal(goal.dailyCalorieGoal);
    }
  };

  const handleDeleteMeal = async (id: string) => {
    await dataStore.deleteMeal(id);
    loadData();
  };

  const progressPercent = Math.min((dailyCalories / calorieGoal) * 100, 100);

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">{tr("today")}</Text>
            <Text className="text-sm text-muted">{new Date().toLocaleDateString()}</Text>
          </View>

          {/* Calorie Progress Card */}
          <View className="bg-surface rounded-3xl p-6 border border-border gap-4">
            {/* Progress Circle */}
            <View className="items-center gap-3">
              <View className="w-40 h-40 rounded-full bg-background items-center justify-center border-8 border-primary relative">
                <View className="items-center gap-1">
                  <Text className="text-4xl font-bold text-primary">{dailyCalories}</Text>
                  <Text className="text-xs text-muted">/ {calorieGoal}</Text>
                </View>
              </View>
              <Text className="text-sm text-muted">{tr("calories")}</Text>
            </View>

            {/* Progress Bar */}
            <View className="gap-2">
              <View className="h-3 bg-background rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">{dailyCalories}</Text>
                <Text className="text-xs text-muted">{calorieGoal}</Text>
              </View>
            </View>

            {/* Macros */}
            <View className="flex-row gap-2">
              <View className="flex-1 bg-background rounded-lg p-3 items-center gap-1">
                <Text className="text-xs text-muted">{tr("protein")}</Text>
                <Text className="text-lg font-semibold text-foreground">{dailyProtein}g</Text>
              </View>
              <View className="flex-1 bg-background rounded-lg p-3 items-center gap-1">
                <Text className="text-xs text-muted">{tr("fat")}</Text>
                <Text className="text-lg font-semibold text-foreground">{dailyFat}g</Text>
              </View>
              <View className="flex-1 bg-background rounded-lg p-3 items-center gap-1">
                <Text className="text-xs text-muted">{tr("carbs")}</Text>
                <Text className="text-lg font-semibold text-foreground">{dailyCarbs}g</Text>
              </View>
            </View>
          </View>

          {/* Camera Button - Main Action */}
          <Pressable
            onPress={() => router.push("/camera")}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <View className="bg-primary rounded-full py-5 items-center justify-center gap-2 shadow-lg">
              <IconSymbol name="camera.fill" size={28} color="white" />
              <Text className="text-white font-semibold text-base">{tr("takePhoto")}</Text>
            </View>
          </Pressable>

          {/* Quick Actions */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-muted">{tr("addFood")}</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-surface rounded-xl p-4 border border-border items-center gap-2 active:opacity-70"
                activeOpacity={0.7}
              >
                <IconSymbol name="pencil" size={24} color={colors.primary} />
                <Text className="text-xs text-foreground text-center">{tr("manualEntry")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-surface rounded-xl p-4 border border-border items-center gap-2 active:opacity-70"
                activeOpacity={0.7}
              >
                <IconSymbol name="barcode" size={24} color={colors.primary} />
                <Text className="text-xs text-foreground text-center">{tr("scanBarcode")}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Meals */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">{tr("recentMeals")}</Text>
              {meals.length > 0 && (
                <Text className="text-sm text-muted">{meals.length} блюд</Text>
              )}
            </View>

            {meals.length === 0 ? (
              <View className="bg-surface rounded-xl p-6 border border-border items-center justify-center py-8">
                <Text className="text-muted text-sm">{tr("noMeals")}</Text>
              </View>
            ) : (
              <View className="gap-2">
                {meals.map((meal) => (
                  <View
                    key={meal.id}
                    className="bg-surface rounded-xl p-4 border border-border flex-row items-center justify-between"
                  >
                    <View className="flex-1 gap-1">
                      <Text className="text-base font-semibold text-foreground">{meal.name}</Text>
                      <Text className="text-sm text-muted">
                        {meal.calories} ккал • {meal.protein}g белок
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteMeal(meal.id)}
                      className="p-2"
                    >
                      <IconSymbol name="xmark" size={20} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
