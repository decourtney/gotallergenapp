import { AllergenPreferences } from "./storageUtils";

export interface AllergenMatch {
  hasAllergens: boolean;
  detectedAllergens: string[];
}

/**
 * Matches product allergens against user's preferences
 * @param allergensTags - Array of allergen tags from OpenFoodFacts API (e.g., ["en:milk", "en:eggs"])
 * @param userPreferences - User's selected allergen preferences
 * @returns Object with match results
 */
export const matchAllergens = (
  allergensTags: string[] | undefined,
  userPreferences: AllergenPreferences
): AllergenMatch => {
  if (!allergensTags || allergensTags.length === 0) {
    return {
      hasAllergens: false,
      detectedAllergens: [],
    };
  }

  // Get list of allergens user cares about
  const selectedAllergens = Object.keys(userPreferences).filter(
    (key) => userPreferences[key]
  );

  if (selectedAllergens.length === 0) {
    return {
      hasAllergens: false,
      detectedAllergens: [],
    };
  }

  const detectedAllergens: string[] = [];

  // Normalize and check each allergen tag
  allergensTags.forEach((tag) => {
    // Remove language prefix (e.g., "en:milk" -> "milk")
    const normalizedTag = tag.toLowerCase().replace(/^[a-z]{2}:/, "");

    // Check against each selected allergen
    selectedAllergens.forEach((allergen) => {
      const allergenKey = allergen.toLowerCase();

      // Direct match or contains match
      if (
        normalizedTag === allergenKey ||
        normalizedTag.includes(allergenKey) ||
        allergenKey.includes(normalizedTag)
      ) {
        // Format allergen name for display (capitalize first letter)
        const displayName =
          allergen.charAt(0).toUpperCase() +
          allergen.slice(1).replace(/_/g, " ");

        if (!detectedAllergens.includes(displayName)) {
          detectedAllergens.push(displayName);
        }
      }
    });
  });

  return {
    hasAllergens: detectedAllergens.length > 0,
    detectedAllergens: detectedAllergens.sort(),
  };
};

/**
 * Get a user-friendly allergen label mapping
 * Maps internal IDs to display names
 */
export const ALLERGEN_DISPLAY_NAMES: { [key: string]: string } = {
  milk: "Milk",
  lactose: "Lactose",
  butter: "Butter",
  cheese: "Cheese",
  eggs: "Eggs",
  peanuts: "Peanuts",
  tree_nuts: "Tree Nuts",
  almonds: "Almonds",
  cashews: "Cashews",
  walnuts: "Walnuts",
  pecans: "Pecans",
  hazelnuts: "Hazelnuts",
  pistachios: "Pistachios",
  macadamia: "Macadamia",
  brazil_nuts: "Brazil Nuts",
  sesame: "Sesame",
  wheat: "Wheat",
  gluten: "Gluten",
  barley: "Barley",
  rye: "Rye",
  oats: "Oats",
  corn: "Corn",
  fish: "Fish",
  shellfish: "Shellfish",
  shrimp: "Shrimp",
  crab: "Crab",
  lobster: "Lobster",
  clams: "Clams",
  mussels: "Mussels",
  oysters: "Oysters",
  soybeans: "Soybeans",
  lupin: "Lupin",
  chickpeas: "Chickpeas",
  celery: "Celery",
  mustard: "Mustard",
  sulfites: "Sulfites",
  msg: "MSG",
};
