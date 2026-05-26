/**
 * Internationalization (i18n) system for Russian and English languages
 */

export type Language = 'ru' | 'en';

export const translations = {
  ru: {
    // Navigation
    home: 'Главная',
    diary: 'Дневник',
    statistics: 'Статистика',
    profile: 'Профиль',
    settings: 'Настройки',

    // Home Screen
    today: 'Сегодня',
    calories: 'Калории',
    caloriesGoal: 'Цель',
    addFood: 'Добавить еду',
    takePhoto: 'Сфотографировать',
    manualEntry: 'Ввести вручную',
    scanBarcode: 'Сканировать штрих-код',
    recentMeals: 'Последние приёмы пищи',
    breakfast: 'Завтрак',
    lunch: 'Обед',
    dinner: 'Ужин',
    snacks: 'Перекусы',

    // Camera Screen
    takePhoto_: 'Сделать снимок',
    cancel: 'Отмена',
    gallery: 'Галерея',
    cameraPermission: 'Требуется доступ к камере',

    // Analysis Result
    analyzing: 'Анализ...',
    foodName: 'Название блюда',
    calories_: 'Калории',
    protein: 'Белки',
    fat: 'Жиры',
    carbs: 'Углеводы',
    servingSize: 'Размер порции',
    add: 'Добавить',
    addToDiary: 'Добавить в дневник',
    grams: 'г',
    xmark: 'Удалить',

    // Diary Screen
    date: 'Дата',
    totalCalories: 'Всего калорий',
    totalProtein: 'Всего белков',
    totalFat: 'Всего жиров',
    totalCarbs: 'Всего углеводов',
    delete: 'Удалить',
    noMeals: 'Нет приёмов пищи',

    // Statistics Screen
    weeklyStats: 'Статистика за неделю',
    monthlyStats: 'Статистика за месяц',
    caloriesTrend: 'Тренд калорий',
    macroDistribution: 'Распределение макронутриентов',
    week: 'Неделя',
    month: 'Месяц',

    // Profile Screen
    myProfile: 'Мой профиль',
    name: 'Имя',
    userName: 'Пользователь',
    weight: 'Вес',
    height: 'Рост',
    activityLevel: 'Уровень активности',
    dailyGoal: 'Дневная цель',
    edit: 'Редактировать',
    save: 'Сохранить',
    enterName: 'Введите ваше имя',
    lightTheme: 'Белый',
    darkTheme: 'Темный',
    aboutApp: 'О приложении',

    // Settings Screen
    language: 'Язык',
    theme: 'Тема оформления',
    notifications: 'Уведомления',
    about: 'О приложении',
    version: 'Версия',
    light: 'Светлая',
    dark: 'Тёмная',
    auto: 'Автоматическая',
    russian: 'Русский',
    english: 'English',

    // Common
    ok: 'OK',
    close: 'Закрыть',
    back: 'Назад',
    next: 'Далее',
    error: 'Ошибка',
    success: 'Успешно',
    loading: 'Загрузка...',
    empty: 'Пусто',
  },
  en: {
    // Navigation
    home: 'Home',
    diary: 'Diary',
    statistics: 'Statistics',
    profile: 'Profile',
    settings: 'Settings',

    // Home Screen
    today: 'Today',
    calories: 'Calories',
    caloriesGoal: 'Goal',
    addFood: 'Add Food',
    takePhoto: 'Take Photo',
    manualEntry: 'Manual Entry',
    scanBarcode: 'Scan Barcode',
    recentMeals: 'Recent Meals',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snacks: 'Snacks',

    // Camera Screen
    takePhoto_: 'Take Photo',
    cancel: 'Cancel',
    gallery: 'Gallery',
    cameraPermission: 'Camera permission required',

    // Analysis Result
    analyzing: 'Analyzing...',
    foodName: 'Food Name',
    calories_: 'Calories',
    protein: 'Protein',
    fat: 'Fat',
    carbs: 'Carbs',
    servingSize: 'Serving Size',
    add: 'Add',
    addToDiary: 'Add to Diary',
    grams: 'g',
    xmark: 'Delete',

    // Diary Screen
    date: 'Date',
    totalCalories: 'Total Calories',
    totalProtein: 'Total Protein',
    totalFat: 'Total Fat',
    totalCarbs: 'Total Carbs',
    delete: 'Delete',
    noMeals: 'No meals',

    // Statistics Screen
    weeklyStats: 'Weekly Statistics',
    monthlyStats: 'Monthly Statistics',
    caloriesTrend: 'Calories Trend',
    macroDistribution: 'Macro Distribution',
    week: 'Week',
    month: 'Month',

    // Profile Screen
    myProfile: 'My Profile',
    name: 'Name',
    userName: 'User',
    weight: 'Weight',
    height: 'Height',
    activityLevel: 'Activity Level',
    dailyGoal: 'Daily Goal',
    edit: 'Edit',
    save: 'Save',
    enterName: 'Enter your name',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    aboutApp: 'About App',

    // Settings Screen
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    about: 'About',
    version: 'Version',
    light: 'Light',
    dark: 'Dark',
    auto: 'Auto',
    russian: 'Русский',
    english: 'English',

    // Common
    ok: 'OK',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    error: 'Error',
    success: 'Success',
    loading: 'Loading...',
    empty: 'Empty',
  },
};

export function t(key: keyof typeof translations.ru, language: Language = 'ru'): string {
  return translations[language][key] || key;
}
