import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Schedule daily calorie reminder
export const scheduleDailyReminder = async (hour: number = 9, minute: number = 0) => {
  try {
    // Cancel existing reminders
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule new reminder
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Напоминание о калориях',
        body: 'Пора записать свой завтрак! Отслеживайте калории для достижения целей.',
        data: { type: 'calorie_reminder' },
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      } as any,
    });

    // Save reminder settings
    await AsyncStorage.setItem('reminder_time', JSON.stringify({ hour, minute }));
    console.log(`Daily reminder scheduled for ${hour}:${minute}`);
  } catch (error) {
    console.error('Error scheduling reminder:', error);
  }
};

// Schedule calorie goal warning
export const scheduleGoalWarning = (currentCalories: number, goalCalories: number) => {
  const percentage = (currentCalories / goalCalories) * 100;

  if (percentage >= 90) {
    Notifications.scheduleNotificationAsync({
      content: {
        title: '⚠️ Приближение к лимиту калорий',
        body: `Вы съели ${Math.round(percentage)}% от дневной нормы (${currentCalories}/${goalCalories} ккал)`,
        data: { type: 'goal_warning', percentage },
      },
      trigger: { seconds: 1 } as any,
    });
  }
};

// Schedule meal logging reminder
export const scheduleMealReminder = (mealType: string, time: string) => {
  const [hour, minute] = time.split(':').map(Number);

  Notifications.scheduleNotificationAsync({
    content: {
      title: `🍽️ Время для ${mealType}`,
      body: `Не забудьте записать свой ${mealType}!`,
      data: { type: 'meal_reminder', mealType },
    },
    trigger: {
      hour,
      minute,
      repeats: true,
    } as any,
  });
};

// Send achievement notification
export const sendAchievementNotification = (achievement: string) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: '🎉 Достижение разблокировано!',
      body: achievement,
      data: { type: 'achievement' },
    },
    trigger: { seconds: 1 } as any,
  });
};

// Send hydration reminder
export const scheduleHydrationReminder = (intervalMinutes: number = 60) => {
  Notifications.scheduleNotificationAsync({
    content: {
      title: '💧 Напоминание о воде',
      body: 'Пора выпить стакан воды! Гидратация важна для здоровья.',
      data: { type: 'hydration_reminder' },
    },
    trigger: {
      seconds: intervalMinutes * 60,
      repeats: true,
    } as any,
  });
};

// Get all scheduled notifications
export const getScheduledNotifications = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return notifications;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

// Cancel all notifications
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

// Listen for notification responses
export const setupNotificationListener = (callback: (notification: Notifications.Notification) => void) => {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    callback(response.notification);
  });

  return subscription;
};
