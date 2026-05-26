import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  date: string; // YYYY-MM-DD
  imageUrl?: string;
}

export interface UserGoal {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
  goalType: 'lose' | 'gain' | 'maintain';
  targetWeight: number;
  dailyCalorieGoal: number;
}

const MEALS_KEY = 'meals';
const GOAL_KEY = 'user_goal';

export const dataStore = {
  // Meals
  async getMeals(date?: string): Promise<Meal[]> {
    try {
      const data = await AsyncStorage.getItem(MEALS_KEY);
      if (!data) return [];
      
      const meals = JSON.parse(data) as Meal[];
      if (date) {
        return meals.filter(m => m.date === date);
      }
      return meals;
    } catch (error) {
      console.error('Failed to get meals:', error);
      return [];
    }
  },

  async addMeal(meal: Omit<Meal, 'id'>): Promise<Meal> {
    try {
      const meals = await this.getMeals();
      const newMeal: Meal = {
        ...meal,
        id: Date.now().toString(),
      };
      meals.push(newMeal);
      await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(meals));
      return newMeal;
    } catch (error) {
      console.error('Failed to add meal:', error);
      throw error;
    }
  },

  async deleteMeal(id: string): Promise<void> {
    try {
      const meals = await this.getMeals();
      const filtered = meals.filter(m => m.id !== id);
      await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete meal:', error);
      throw error;
    }
  },

  async getTodayMeals(): Promise<Meal[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getMeals(today);
  },

  async getTodayStats(): Promise<{
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  }> {
    const meals = await this.getTodayMeals();
    return {
      calories: meals.reduce((sum, m) => sum + m.calories, 0),
      protein: meals.reduce((sum, m) => sum + m.protein, 0),
      fat: meals.reduce((sum, m) => sum + m.fat, 0),
      carbs: meals.reduce((sum, m) => sum + m.carbs, 0),
    };
  },

  // User Goal
  async getGoal(): Promise<UserGoal | null> {
    try {
      const data = await AsyncStorage.getItem(GOAL_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get goal:', error);
      return null;
    }
  },

  async setGoal(goal: UserGoal): Promise<void> {
    try {
      await AsyncStorage.setItem(GOAL_KEY, JSON.stringify(goal));
    } catch (error) {
      console.error('Failed to set goal:', error);
      throw error;
    }
  },

  // Calculate daily calorie goal based on user data
  calculateDailyCalories(goal: UserGoal): number {
    // Harris-Benedict formula for BMR
    let bmr: number;
    if (goal.gender === 'male') {
      bmr = 88.362 + (13.397 * goal.weight) + (4.799 * goal.height) - (5.677 * goal.age);
    } else {
      bmr = 447.593 + (9.247 * goal.weight) + (3.098 * goal.height) - (4.330 * goal.age);
    }

    // Activity multiplier
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = bmr * activityMultipliers[goal.activityLevel];

    // Adjust based on goal
    if (goal.goalType === 'lose') {
      return Math.round(tdee - 500); // 500 cal deficit for ~0.5kg/week loss
    } else if (goal.goalType === 'gain') {
      return Math.round(tdee + 500); // 500 cal surplus for ~0.5kg/week gain
    }
    return Math.round(tdee);
  },
};
