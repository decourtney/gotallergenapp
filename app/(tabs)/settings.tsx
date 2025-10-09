import { COLORS } from "@/src/constants/theme";
import {
  AllergenPreferences,
  getAllergenPreferences,
  getScannerMode,
  saveAllergenPreferences,
  saveScannerMode,
  ScannerMode,
  setSetupComplete,
} from "@/src/utils/storageUtils";
import { useTheme } from "@react-navigation/native";
import { Image } from "expo-image";
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

export default function Settings() {
  const navigation = useNavigation();
  const [allergens, setAllergens] = useState<AllergenPreferences>({});
  const [scannerMode, setScannerMode] = useState<ScannerMode>("manual");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [expandedParents, setExpandedParents] = useState<Set<string>>(
    new Set()
  );
  const { dark } = useTheme(); // `dark` is a boolean

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Settings",
      headerRight: () => (
        <Image
          source={
            dark
              ? require("@/assets/images/gotallergen_logo_dark.png")
              : require("@/assets/images/gotallergen_logo_light.png")
          }
          style={{ width: 128, height: 64, marginLeft: 0 }}
          contentFit="contain"
        />
      ),
    });

    loadPreferences();
  }, [navigation, useTheme()]);

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
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{getSelectedCount()} selected</Text>
        </View>
        <Text style={styles.attributionText}>
          Data provided by OpenFoodFacts.org, licensed under ODbL
        </Text>
      </View>

      {/* Scanner Mode Toggle */}
      <View style={styles.scannerModeSection}>
        <View style={styles.scannerModeCard}>
          <View style={styles.scannerModeIcon}>
            <Text style={styles.iconText}>📷</Text>
          </View>
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
            trackColor={{ false: COLORS.border, true: COLORS.secondaryLight }}
            thumbColor={
              scannerMode === "auto" ? COLORS.secondary : COLORS.white
            }
            ios_backgroundColor={COLORS.border}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.categoriesContainer}>
          {ALLERGEN_CATEGORIES.map(({ category, items }) => (
            <View key={category} style={styles.categoryContainer}>
              <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => toggleCategory(category)}
                activeOpacity={0.7}
              >
                <View style={styles.categoryTitleContainer}>
                  <Text style={styles.categoryIcon}>
                    {expandedCategories.has(category) ? "▼" : "▶"}
                  </Text>
                  <Text style={styles.categoryTitle}>{category}</Text>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {items.reduce((count, item) => {
                      if (item.children) {
                        return (
                          count +
                          item.children.filter((child) => allergens[child.id])
                            .length
                        );
                      }
                      return count + (allergens[item.id] ? 1 : 0);
                    }, 0)}
                  </Text>
                </View>
              </TouchableOpacity>

              {expandedCategories.has(category) && (
                <View style={styles.itemsContainer}>
                  {items.map((item) => (
                    <View key={item.id}>
                      <View style={styles.itemRow}>
                        <TouchableOpacity
                          style={styles.itemLabel}
                          onPress={() => toggleAllergen(item.id, item.children)}
                          activeOpacity={0.7}
                        >
                          {item.children && (
                            <TouchableOpacity
                              onPress={() => toggleParent(item.id)}
                              style={styles.nestedExpandIcon}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.expandIconSmall}>
                                {expandedParents.has(item.id) ? "▼" : "▶"}
                              </Text>
                            </TouchableOpacity>
                          )}
                          <Text
                            style={[
                              styles.itemText,
                              isParentChecked(item) && styles.itemTextActive,
                            ]}
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                        <Switch
                          value={isParentChecked(item)}
                          onValueChange={() =>
                            toggleAllergen(item.id, item.children)
                          }
                          trackColor={{
                            false: COLORS.border,
                            true: COLORS.primaryLight,
                          }}
                          thumbColor={
                            isParentChecked(item)
                              ? COLORS.primary
                              : COLORS.white
                          }
                          ios_backgroundColor={COLORS.border}
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
                                activeOpacity={0.7}
                              >
                                <Text
                                  style={[
                                    styles.itemText,
                                    allergens[child.id] &&
                                      styles.itemTextActive,
                                  ]}
                                >
                                  {child.label}
                                </Text>
                              </TouchableOpacity>
                              <Switch
                                value={allergens[child.id] || false}
                                onValueChange={() => toggleAllergen(child.id)}
                                trackColor={{
                                  false: COLORS.border,
                                  true: COLORS.primaryLight,
                                }}
                                thumbColor={
                                  allergens[child.id]
                                    ? COLORS.primary
                                    : COLORS.white
                                }
                                ios_backgroundColor={COLORS.border}
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
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 12,
  },
  attributionText: { fontSize: 12, color: COLORS.textLight, marginTop: 12 },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
  },
  categoriesContainer: {
    padding: 16,
  },
  categoryContainer: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    overflow: "hidden",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
  },
  categoryTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    fontSize: 14,
    color: COLORS.primary,
    marginRight: 12,
    width: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  categoryBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 28,
    alignItems: "center",
  },
  categoryBadgeText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "700",
  },
  itemsContainer: {
    backgroundColor: COLORS.white,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
  },
  itemLabel: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  nestedExpandIcon: {
    marginRight: 12,
    padding: 4,
  },
  expandIconSmall: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  itemTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  nestedContainer: {
    paddingLeft: 32,
    backgroundColor: COLORS.background,
  },
  scannerModeSection: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  scannerModeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  scannerModeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  iconText: {
    fontSize: 24,
  },
  scannerModeInfo: {
    flex: 1,
    marginRight: 12,
  },
  scannerModeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  scannerModeDescription: {
    fontSize: 13,
    color: COLORS.textLight,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 20,
  },
});
