import AsyncStorage from "@react-native-async-storage/async-storage";

const ALLERGENS_KEY = "@allergen_preferences";
const SETUP_COMPLETE_KEY = "@setup_complete";
const SEARCH_HISTORY_KEY = "@search_history";

export interface AllergenPreferences {
  [key: string]: boolean;
}

export interface SearchHistoryItem {
  id: string;
  productName: string;
  barcode?: string;
  timestamp: number;
  allergens: string[];
  imageUrl?: string;
}

// Allergen Preferences
export const saveAllergenPreferences = async (
  preferences: AllergenPreferences
): Promise<void> => {
  try {
    await AsyncStorage.setItem(ALLERGENS_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving allergen preferences:", error);
  }
};

export const getAllergenPreferences =
  async (): Promise<AllergenPreferences> => {
    try {
      const value = await AsyncStorage.getItem(ALLERGENS_KEY);
      return value ? JSON.parse(value) : {};
    } catch (error) {
      console.error("Error loading allergen preferences:", error);
      return {};
    }
  };

// Setup Complete Flag
export const setSetupComplete = async (complete: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETUP_COMPLETE_KEY, JSON.stringify(complete));
  } catch (error) {
    console.error("Error saving setup status:", error);
  }
};

export const isSetupComplete = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(SETUP_COMPLETE_KEY);
    return value ? JSON.parse(value) : false;
  } catch (error) {
    console.error("Error loading setup status:", error);
    return false;
  }
};

// Search History
export const addToSearchHistory = async (
  item: Omit<SearchHistoryItem, "id" | "timestamp">
): Promise<void> => {
  try {
    const history = await getSearchHistory();
    const newItem: SearchHistoryItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    const updatedHistory = [newItem, ...history].slice(0, 50); // Keep last 50 items
    await AsyncStorage.setItem(
      SEARCH_HISTORY_KEY,
      JSON.stringify(updatedHistory)
    );
  } catch (error) {
    console.error("Error adding to search history:", error);
  }
};

export const getSearchHistory = async (): Promise<SearchHistoryItem[]> => {
  try {
    const value = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error("Error loading search history:", error);
    return [];
  }
};

export const clearSearchHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing search history:", error);
  }
};
