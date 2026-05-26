import { useEffect, useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useTranslation } from '@/hooks/use-translation';
import { useColors } from '@/hooks/use-colors';
import { dataStore, type UserGoal } from '@/lib/data-store';

export default function GoalsScreen() {
  const tr = useTranslation();
  const colors = useColors();

  const [goal, setGoal] = useState<UserGoal | null>(null);
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('30');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive'>('moderate');
  const [goalType, setGoalType] = useState<'lose' | 'maintain' | 'gain'>('lose');
  const [targetWeight, setTargetWeight] = useState('65');
  const [dailyCalories, setDailyCalories] = useState('2000');

  useEffect(() => {
    loadGoal();
  }, []);

  const loadGoal = async () => {
    const savedGoal = await dataStore.getGoal();
    if (savedGoal) {
      setGoal(savedGoal);
      setWeight(savedGoal.weight.toString());
      setHeight(savedGoal.height.toString());
      setAge(savedGoal.age.toString());
      setGender(savedGoal.gender);
      setActivityLevel(savedGoal.activityLevel);
      setGoalType(savedGoal.goalType);
      setTargetWeight(savedGoal.targetWeight.toString());
      setDailyCalories(savedGoal.dailyCalorieGoal.toString());
    }
  };

  const handleSaveGoal = async () => {
    const newGoal: UserGoal = {
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: parseInt(age),
      gender,
      activityLevel,
      goalType,
      targetWeight: parseFloat(targetWeight),
      dailyCalorieGoal: parseInt(dailyCalories),
    };

    await dataStore.setGoal(newGoal);
    setGoal(newGoal);
  };

  const handleCalculateCalories = () => {
    const newGoal: UserGoal = {
      weight: parseFloat(weight),
      height: parseFloat(height),
      age: parseInt(age),
      gender,
      activityLevel,
      goalType,
      targetWeight: parseFloat(targetWeight),
      dailyCalorieGoal: 2000,
    };

    const calories = dataStore.calculateDailyCalories(newGoal);
    setDailyCalories(calories.toString());
  };

  const getActivityLabel = () => {
    const labels = {
      sedentary: 'Сидячий образ жизни',
      light: 'Лёгкая активность',
      moderate: 'Умеренная активность',
      active: 'Высокая активность',
      veryActive: 'Очень высокая активность',
    };
    return labels[activityLevel];
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-4">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Цель</Text>
            <Text className="text-sm text-muted">Установите свою цель для здорового питания</Text>
          </View>

          {/* Personal Info */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-4">
            <Text className="text-lg font-semibold text-foreground">Личные данные</Text>

            <View className="gap-3">
              <View className="gap-1">
                <Text className="text-sm text-muted">Вес (кг)</Text>
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="decimal-pad"
                  className="bg-background rounded-lg px-4 py-3 text-foreground border border-border"
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View className="gap-1">
                <Text className="text-sm text-muted">Рост (см)</Text>
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="decimal-pad"
                  className="bg-background rounded-lg px-4 py-3 text-foreground border border-border"
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View className="gap-1">
                <Text className="text-sm text-muted">Возраст (лет)</Text>
                <TextInput
                  value={age}
                  onChangeText={setAge}
                  keyboardType="number-pad"
                  className="bg-background rounded-lg px-4 py-3 text-foreground border border-border"
                  placeholderTextColor={colors.muted}
                />
              </View>
            </View>
          </View>

          {/* Activity Level */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Уровень активности</Text>
            <View className="gap-2">
              {[
                { type: 'sedentary' as const, label: 'Сидячий' },
                { type: 'light' as const, label: 'Лёгкая' },
                { type: 'moderate' as const, label: 'Умеренная' },
                { type: 'active' as const, label: 'Высокая' },
                { type: 'veryActive' as const, label: 'Очень высокая' },
              ].map(({ type, label }) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setActivityLevel(type)}
                  className={`rounded-lg py-3 px-4 border ${
                    activityLevel === type ? 'bg-primary border-primary' : 'bg-background border-border'
                  }`}
                >
                  <Text className={activityLevel === type ? 'text-white font-semibold' : 'text-foreground'}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Gender Selection */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Пол</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setGender('male')}
                className={`flex-1 rounded-lg py-3 items-center border ${
                  gender === 'male' ? 'bg-primary border-primary' : 'bg-background border-border'
                }`}
              >
                <Text className={gender === 'male' ? 'text-white font-semibold' : 'text-foreground'}>
                  Мужчина
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender('female')}
                className={`flex-1 rounded-lg py-3 items-center border ${
                  gender === 'female' ? 'bg-primary border-primary' : 'bg-background border-border'
                }`}
              >
                <Text className={gender === 'female' ? 'text-white font-semibold' : 'text-foreground'}>
                  Женщина
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Goal Type */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Ваша цель</Text>
            <View className="gap-2">
              {[
                { type: 'lose' as const, label: 'Похудеть' },
                { type: 'maintain' as const, label: 'Поддерживать вес' },
                { type: 'gain' as const, label: 'Набрать вес' },
              ].map(({ type, label }) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => setGoalType(type)}
                  className={`rounded-lg py-3 px-4 border ${
                    goalType === type ? 'bg-primary border-primary' : 'bg-background border-border'
                  }`}
                >
                  <Text className={goalType === type ? 'text-white font-semibold' : 'text-foreground'}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Target Weight */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">Целевой вес (кг)</Text>
            <TextInput
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="decimal-pad"
              className="bg-background rounded-lg px-4 py-3 text-foreground border border-border"
              placeholderTextColor={colors.muted}
            />
          </View>

          {/* Daily Calories */}
          <View className="bg-surface rounded-2xl p-6 border border-border gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground">Дневная норма калорий</Text>
              <Text className="text-2xl font-bold text-primary">{dailyCalories}</Text>
            </View>
            <Text className="text-sm text-muted">Рассчитано на основе ваших данных</Text>
          </View>

          {/* Calculate Button */}
          <TouchableOpacity
            onPress={handleCalculateCalories}
            className="bg-accent rounded-full py-4 items-center justify-center"
          >
            <Text className="text-white font-semibold text-base">Рассчитать калории</Text>
          </TouchableOpacity>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSaveGoal}
            className="bg-primary rounded-full py-4 items-center justify-center"
          >
            <Text className="text-white font-semibold text-base">Сохранить цель</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
