import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child, remove } from 'firebase/database';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Firebase configuration
// Replace with your Firebase project credentials
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoKey123456789',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'calolife-demo.firebaseapp.com',
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL || 'https://calolife-demo.firebaseio.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'calolife-demo',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'calolife-demo.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abc123def456',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Sign in anonymously
export const initializeAuth = async () => {
  try {
    await signInAnonymously(auth);
    console.log('Firebase auth initialized');
  } catch (error) {
    console.error('Firebase auth error:', error);
  }
};

// Save meals to Firebase
export const saveMealsToCloud = async (userId: string, meals: any[]) => {
  try {
    const mealsRef = ref(database, `users/${userId}/meals`);
    await set(mealsRef, meals);
    console.log('Meals saved to Firebase');
  } catch (error) {
    console.error('Error saving meals:', error);
  }
};

// Get meals from Firebase
export const getMealsFromCloud = async (userId: string) => {
  try {
    const mealsRef = ref(database, `users/${userId}/meals`);
    const snapshot = await get(mealsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return [];
  } catch (error) {
    console.error('Error getting meals:', error);
    return [];
  }
};

// Save user goal to Firebase
export const saveGoalToCloud = async (userId: string, goal: any) => {
  try {
    const goalRef = ref(database, `users/${userId}/goal`);
    await set(goalRef, goal);
    console.log('Goal saved to Firebase');
  } catch (error) {
    console.error('Error saving goal:', error);
  }
};

// Get user goal from Firebase
export const getGoalFromCloud = async (userId: string) => {
  try {
    const goalRef = ref(database, `users/${userId}/goal`);
    const snapshot = await get(goalRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Error getting goal:', error);
    return null;
  }
};

// Delete meal from Firebase
export const deleteMealFromCloud = async (userId: string, mealId: string) => {
  try {
    const mealRef = ref(database, `users/${userId}/meals/${mealId}`);
    await remove(mealRef);
    console.log('Meal deleted from Firebase');
  } catch (error) {
    console.error('Error deleting meal:', error);
  }
};

export { database, auth };
