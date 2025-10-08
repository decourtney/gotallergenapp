import {
  AllergenPreferences,
  getAllergenPreferences,
  getScannerMode,
  saveAllergenPreferences,
  ScannerMode,
  setSetupComplete,
  saveScannerMode
} from "@/src/utils/storageUtils";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AllergenItem {
  id: string;
  label: string;
  children?: AllergenItem[];
}

const ALLERGEN_CATEGORIES: { category: string; items: AllergenItem[] }[] = [
  {
    category: "Dairy",
    items: [
      { id: "milk", label: "Milk" },
      { id: "lactose", label: "Lactose" },
      { id: "butter", label: "Butter" },
      { id: "cheese", label: "Cheese" },
    ],
  },
  {
    category: "Eggs",
    items: [{ id: "eggs", label: "Eggs" }],
  },
  {
    category: "Nuts & Seeds",
    items: [
      { id: "peanuts", label: "Peanuts" },
      {
        id: "tree_nuts",
        label: "Tree Nuts",
        children: [
          { id: "almonds", label: "Almonds" },
          { id: "cashews", label: "Cashews" },
          { id: "walnuts", label: "Walnuts" },
          { id: "pecans", label: "Pecans" },
          { id: "hazelnuts", label: "Hazelnuts" },
          { id: "pistachios", label: "Pistachios" },
          { id: "macadamia", label: "Macadamia" },
          { id: "brazil_nuts", label: "Brazil Nuts" },
        ],
      },
      { id: "sesame", label: "Sesame" },
    ],
  },
  {
    category: "Grains",
    items: [
      { id: "wheat", label: "Wheat" },
      { id: "gluten", label: "Gluten" },
      { id: "barley", label: "Barley" },
      { id: "rye", label: "Rye" },
      { id: "oats", label: "Oats" },
      { id: "corn", label: "Corn" },
    ],
  },
  {
    category: "Seafood",
    items: [
      { id: "fish", label: "Fish" },
      {
        id: "shellfish",
        label: "Shellfish",
        children: [
          { id: "shrimp", label: "Shrimp" },
          { id: "crab", label: "Crab" },
          { id: "lobster", label: "Lobster" },
          { id: "clams", label: "Clams" },
          { id: "mussels", label: "Mussels" },
          { id: "oysters", label: "Oysters" },
        ],
      },
    ],
  },
  {
    category: "Legumes",
    items: [
      { id: "soybeans", label: "Soybeans" },
      { id: "lupin", label: "Lupin" },
      { id: "chickpeas", label: "Chickpeas" },
    ],
  },
  {
    category: "Vegetables",
    items: [
      { id: "celery", label: "Celery" },
      { id: "mustard", label: "Mustard" },
    ],
  },
  {
    category: "Additives",
    items: [
      { id: "sulfites", label: "Sulfites" },
      { id: "msg", label: "MSG" },
    ],
  },
];

export default function Profile() {
  const navigation = useNavigation();
  const [allergens, setAllergens] = useState<AllergenPreferences>({});
  const [scannerMode, setScannerMode] = useState<ScannerMode>("manual");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [expandedParents, setExpandedParents] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "My Preferences",
    });
    loadPreferences();
  }, [navigation]);

  const loadPreferences = async () => {
    const prefs = await getAllergenPreferences();
    setAllergens(prefs);
    const mode = await getScannerMode();
    setScannerMode(mode);
  };

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const toggleParent = (parentId: string) => {
    setExpandedParents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(parentId)) {
        newSet.delete(parentId);
      } else {
        newSet.add(parentId);
      }
      return newSet;
    });
  };

  const toggleAllergen = async (id: string, children?: AllergenItem[]) => {
    const newValue = !allergens[id];
    const updatedAllergens = { ...allergens, [id]: newValue };

    // If toggling a parent with children, toggle all children too
    if (children) {
      children.forEach((child) => {
        updatedAllergens[child.id] = newValue;
      });
    }

    setAllergens(updatedAllergens);
    await saveAllergenPreferences(updatedAllergens);

    // Mark setup as complete if at least one allergen is selected
    const hasSelection = Object.values(updatedAllergens).some((v) => v);
    await setSetupComplete(hasSelection);
  };

  const isParentChecked = (item: AllergenItem): boolean => {
    if (!item.children) return allergens[item.id] || false;
    return item.children.every((child) => allergens[child.id]);
  };

  const getSelectedCount = () => {
    return Object.values(allergens).filter((v) => v).length;
  };

  const toggleScannerMode = async () => {
    const newMode: ScannerMode = scannerMode === "manual" ? "auto" : "manual";
    setScannerMode(newMode);
    await saveScannerMode(newMode);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Select the allergens you want to track
        </Text>
        <Text style={styles.selectedCount}>{getSelectedCount()} selected</Text>
      </View>

      {/* Scanner Mode Toggle */}
      <View style={styles.scannerModeSection}>
        <View style={styles.scannerModeHeader}>
          <View style={styles.scannerModeInfo}>
            <Text style={styles.scannerModeTitle}>Scanner Mode</Text>
            <Text style={styles.scannerModeDescription}>
              {scannerMode === "manual"
                ? "Tap to capture barcode"
                : "Automatically scan visible barcodes"}
            </Text>
          </View>
          <Switch
            value={scannerMode === "auto"}
            onValueChange={toggleScannerMode}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={scannerMode === "auto" ? "#2196F3" : "#f4f3f4"}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {ALLERGEN_CATEGORIES.map(({ category, items }) => (
          <View key={category} style={styles.categoryContainer}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category)}
            >
              <Text style={styles.categoryTitle}>{category}</Text>
              <Text style={styles.expandIcon}>
                {expandedCategories.has(category) ? "▼" : "▶"}
              </Text>
            </TouchableOpacity>

            {expandedCategories.has(category) && (
              <View style={styles.itemsContainer}>
                {items.map((item) => (
                  <View key={item.id}>
                    <View style={styles.itemRow}>
                      <TouchableOpacity
                        style={styles.itemLabel}
                        onPress={() => toggleAllergen(item.id, item.children)}
                      >
                        {item.children && (
                          <TouchableOpacity
                            onPress={() => toggleParent(item.id)}
                            style={styles.nestedExpandIcon}
                          >
                            <Text style={styles.expandIconSmall}>
                              {expandedParents.has(item.id) ? "▼" : "▶"}
                            </Text>
                          </TouchableOpacity>
                        )}
                        <Text style={styles.itemText}>{item.label}</Text>
                      </TouchableOpacity>
                      <Switch
                        value={isParentChecked(item)}
                        onValueChange={() =>
                          toggleAllergen(item.id, item.children)
                        }
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={
                          isParentChecked(item) ? "#2196F3" : "#f4f3f4"
                        }
                      />
                    </View>

                    {/* Nested children */}
                    {item.children && expandedParents.has(item.id) && (
                      <View style={styles.nestedContainer}>
                        {item.children.map((child) => (
                          <View key={child.id} style={styles.itemRow}>
                            <TouchableOpacity
                              style={styles.itemLabel}
                              onPress={() => toggleAllergen(child.id)}
                            >
                              <Text style={styles.itemText}>{child.label}</Text>
                            </TouchableOpacity>
                            <Switch
                              value={allergens[child.id] || false}
                              onValueChange={() => toggleAllergen(child.id)}
                              trackColor={{ false: "#767577", true: "#81b0ff" }}
                              thumbColor={
                                allergens[child.id] ? "#2196F3" : "#f4f3f4"
                              }
                            />
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  selectedCount: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  expandIcon: {
    fontSize: 16,
    color: "#666",
  },
  expandIconSmall: {
    fontSize: 12,
    color: "#666",
  },
  itemsContainer: {
    backgroundColor: "#fff",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemLabel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  nestedExpandIcon: {
    marginRight: 8,
    padding: 4,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  nestedContainer: {
    paddingLeft: 32,
    backgroundColor: "#fafafa",
  },
  scannerModeSection: {
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  scannerModeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  scannerModeInfo: {
    flex: 1,
    marginRight: 16,
  },
  scannerModeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  scannerModeDescription: {
    fontSize: 13,
    color: "#666",
  },
});
