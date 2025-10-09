import { COLORS } from "@/src/constants/theme";
import { AllergenMatch } from "@/src/utils/allergenMatcher";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface AllergenResultsProps {
  product: any | null;
  allergenMatch: AllergenMatch | null;
  isLoading: boolean;
  error: string | null;
}

export const AllergenResults = ({
  product,
  allergenMatch,
  isLoading,
  error,
}: AllergenResultsProps) => {
  const [showIngredients, setShowIngredients] = useState(false);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
          <Text style={styles.loadingText}>Checking product...</Text>
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  // Empty state - no product loaded
  if (!product || !allergenMatch) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.emptyStateContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.emptyState}>
            <Image
              source={require("@/assets/images/gotallergen_large_logo_light.png")}
              style={{ height: 128, width: 256 }}
              contentFit="contain"
              alt="Cartoon cow holding a glass of milk with the phrase, got allergen?, at the bottom"
            />
            <Text style={styles.emptySubtitle}>
              Scan a barcode or search for a product to check for allergens
            </Text>

            <View style={styles.warningBox}>
              <Text style={styles.warningIcon}>⚠️</Text>
              <Text style={styles.warningText}>
                <Text style={styles.warningBold}>Important:</Text> Always check
                the physical product label. This app provides guidance but
                should not replace reading actual ingredient lists.
                Manufacturers may change formulations without notice.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Product loaded - show results
  const productName =
    product.product_name || product.product_name_en || "Unknown Product";
  const productImage = product.image_url || product.image_front_url;
  const ingredients = product.ingredients_text || product.ingredients_text_en;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Allergen Alert */}
      <View
        style={[
          styles.alertBox,
          allergenMatch.hasAllergens ? styles.alertDanger : styles.alertSafe,
        ]}
      >
        <Text style={styles.alertIcon}>
          {allergenMatch.hasAllergens ? "⚠️" : "✓"}
        </Text>
        <View style={styles.alertContent}>
          {allergenMatch.hasAllergens ? (
            <>
              <Text style={[styles.alertTitle, styles.alertTitleDanger]}>
                Allergens Detected
              </Text>
              <Text style={styles.alertSubtitle}>
                Contains: {allergenMatch.detectedAllergens.join(", ")}
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.alertTitle, styles.alertTitleSafe]}>
                No Allergens Detected
              </Text>
              <Text style={styles.alertSubtitle}>
                Safe based on your preferences
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Product Info */}
      <View style={styles.productSection}>
        <Text style={styles.sectionTitle}>Product Information</Text>

        <View style={styles.productCard}>
          {productImage && (
            <Image
              source={{ uri: productImage }}
              style={styles.productImage}
              contentFit="contain"
            />
          )}
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{productName}</Text>
            {product.brands && (
              <Text style={styles.productBrand}>{product.brands}</Text>
            )}
            {product.code && (
              <Text style={styles.productBarcode}>Barcode: {product.code}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Detected Allergens List */}
      {allergenMatch.hasAllergens && (
        <View style={styles.allergensSection}>
          <Text style={styles.sectionTitle}>Your Allergens Found</Text>
          <View style={styles.allergensList}>
            {allergenMatch.detectedAllergens.map((allergen, index) => (
              <View key={index} style={styles.allergenItem}>
                <Text style={styles.allergenDot}>•</Text>
                <Text style={styles.allergenText}>{allergen}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Ingredients - Collapsible */}
      {ingredients && (
        <View style={styles.ingredientsSection}>
          <TouchableOpacity
            style={styles.ingredientsHeader}
            onPress={() => setShowIngredients(!showIngredients)}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.expandIcon}>{showIngredients ? "▼" : "▶"}</Text>
          </TouchableOpacity>

          {showIngredients && (
            <View style={styles.ingredientsContent}>
              <Text style={styles.ingredientsText}>{ingredients}</Text>
            </View>
          )}
        </View>
      )}

      {/* Bottom Warning */}
      <View style={styles.bottomWarning}>
        <Text style={styles.bottomWarningText}>
          Always verify ingredients on the physical product label
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    textAlign: "center",
    fontWeight: "500",
  },
  emptyStateContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    padding: 24,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: COLORS.warningLight,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: "#5D4037",
    lineHeight: 20,
  },
  warningBold: {
    fontWeight: "700",
  },
  alertBox: {
    flexDirection: "row",
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#00000015",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  alertDanger: {
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.danger,
  },
  alertSafe: {
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  alertIcon: {
    fontSize: 36,
    marginRight: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  alertTitleDanger: {
    color: COLORS.danger,
  },
  alertTitleSafe: {
    color: COLORS.primary,
  },
  alertSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },
  productSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#00000010",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  productBarcode: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  allergensSection: {
    padding: 16,
    paddingTop: 0,
  },
  allergensList: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#00000010",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  allergenItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.dangerLight,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  allergenDot: {
    fontSize: 16,
    color: COLORS.danger,
    marginRight: 8,
    fontWeight: "700",
  },
  allergenText: {
    fontSize: 15,
    color: COLORS.danger,
    fontWeight: "600",
  },
  ingredientsSection: {
    padding: 16,
    paddingTop: 0,
  },
  ingredientsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#00000010",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  expandIcon: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: "700",
  },
  ingredientsContent: {
    marginTop: 8,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    shadowColor: "#00000010",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  ingredientsText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },
  bottomWarning: {
    margin: 16,
    padding: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bottomWarningText: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: "center",
    fontStyle: "italic",
  },
});
