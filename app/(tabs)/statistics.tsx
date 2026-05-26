import { ScrollView, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { dataStore } from "@/lib/data-store";

export default function StatisticsScreen() {
  const colors = useColors();
  const [weekData, setWeekData] = useState<{ day: string; calories: number }[]>([]);
  const [totalStats, setTotalStats] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0 });

  useFocusEffect(
    useCallback(() => {
      loadWeekData();
    }, [])
  );

  const loadWeekData = async () => {
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const today = new Date();
    const data = [];
    let totalCals = 0, totalProt = 0, totalFat = 0, totalCarbs = 0;

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const meals = await dataStore.getMeals(dateStr);
      const cals = meals.reduce((sum, m) => sum + m.calories, 0);
      totalCals += cals;
      totalProt += meals.reduce((sum, m) => sum + m.protein, 0);
      totalFat += meals.reduce((sum, m) => sum + m.fat, 0);
      totalCarbs += meals.reduce((sum, m) => sum + m.carbs, 0);
      data.push({ day: days[date.getDay() === 0 ? 6 : date.getDay() - 1], calories: cals });
    }

    setWeekData(data);
    setTotalStats({ calories: totalCals, protein: totalProt, fat: totalFat, carbs: totalCarbs });
  };

  const maxCalories = Math.max(...weekData.map(d => d.calories), 1);
  const total = totalStats.protein + totalStats.fat + totalStats.carbs;
  const proteinPct = total > 0 ? Math.round((totalStats.protein / total) * 100) : 33;
  const fatPct = total > 0 ? Math.round((totalStats.fat / total) * 100) : 33;
  const carbsPct = total > 0 ? 100 - proteinPct - fatPct : 34;

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          {/* Header */}
          <View className="gap-1">
            <Text className="text-3xl font-bold text-foreground">Статистика</Text>
            <Text className="text-sm text-muted">За последние 7 дней</Text>
          </View>

          {/* Weekly Summary */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center gap-1">
              <Text className="text-2xl font-bold text-primary">{totalStats.calories}</Text>
              <Text className="text-xs text-muted">ккал за неделю</Text>
            </View>
            <View className="flex-1 bg-surface rounded-2xl p-4 border border-border items-center gap-1">
              <Text className="text-2xl font-bold text-foreground">{Math.round(totalStats.calories / 7)}</Text>
              <Text className="text-xs text-muted">ккал в день</Text>
            </View>
          </View>

          {/* Calories Chart */}
          <View className="bg-surface rounded-2xl p-5 border border-border gap-4">
            <Text className="text-base font-semibold text-foreground">Калории по дням</Text>
            <View className="flex-row items-end justify-between" style={{ height: 120 }}>
              {weekData.map((item, index) => {
                const barHeight = maxCalories > 0 ? Math.max((item.calories / maxCalories) * 100, item.calories > 0 ? 8 : 4) : 4;
                return (
                  <View key={index} className="flex-1 items-center gap-2">
                    <Text className="text-xs text-muted">{item.calories > 0 ? item.calories : ''}</Text>
                    <View
                      className="w-8 rounded-t-md"
                      style={{
                        height: barHeight,
                        backgroundColor: item.calories > 0 ? colors.primary : colors.border,
                      }}
                    />
                    <Text className="text-xs text-muted">{item.day}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Macro Distribution */}
          <View className="bg-surface rounded-2xl p-5 border border-border gap-4">
            <Text className="text-base font-semibold text-foreground">Макронутриенты (неделя)</Text>
            
            {/* Bar */}
            <View className="h-4 rounded-full overflow-hidden flex-row">
              <View style={{ flex: proteinPct, backgroundColor: '#51CF66' }} />
              <View style={{ flex: fatPct, backgroundColor: '#FF6B6B' }} />
              <View style={{ flex: carbsPct, backgroundColor: '#4ECDC4' }} />
            </View>

            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#51CF66' }} />
                  <Text className="text-sm text-foreground">Белки</Text>
                </View>
                <Text className="text-sm font-semibold text-foreground">{totalStats.protein}г ({proteinPct}%)</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF6B6B' }} />
                  <Text className="text-sm text-foreground">Жиры</Text>
                </View>
                <Text className="text-sm font-semibold text-foreground">{totalStats.fat}г ({fatPct}%)</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <View className="w-3 h-3 rounded-full" style={{ backgroundColor: '#4ECDC4' }} />
                  <Text className="text-sm text-foreground">Углеводы</Text>
                </View>
                <Text className="text-sm font-semibold text-foreground">{totalStats.carbs}г ({carbsPct}%)</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
