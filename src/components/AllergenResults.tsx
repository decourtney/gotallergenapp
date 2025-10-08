import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { AllergenMatch } from "@/src/utils/allergenMatcher";

interface AllergenResultsProps {
  product: any | null;
  allergenMatch: AllergenMatch | null;
  isLoading: boolean;
  error: string | null;
}

export const AllergenResults: React.FC<AllergenResultsProps> = ({
  product,
  allergenMatch,
  isLoading,
  error,
}) => {
  const [showIngredients, setShowIngredients] = useState(false);

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
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
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Ready to scan</Text>
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
              <Text style={styles.alertTitle}>Allergens Detected</Text>
              <Text style={styles.alertSubtitle}>
                Contains: {allergenMatch.detectedAllergens.join(", ")}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.alertTitle}>No Allergens Detected</Text>
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
              resizeMode="contain"
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
          {allergenMatch.detectedAllergens.map((allergen, index) => (
            <View key={index} style={styles.allergenItem}>
              <Text style={styles.allergenDot}>•</Text>
              <Text style={styles.allergenText}>{allergen}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Ingredients - Collapsible */}
      {ingredients && (
        <View style={styles.ingredientsSection}>
          <TouchableOpacity
            style={styles.ingredientsHeader}
            onPress={() => setShowIngredients(!showIngredients)}
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
    backgroundColor: "#fff",
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
    color: "#666",
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
    color: "#d32f2f",
    textAlign: "center",
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
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ffc107",
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: "#856404",
    lineHeight: 20,
  },
  warningBold: {
    fontWeight: "700",
  },
  alertBox: {
    flexDirection: "row",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  alertDanger: {
    backgroundColor: "#ffebee",
    borderWidth: 2,
    borderColor: "#d32f2f",
  },
  alertSafe: {
    backgroundColor: "#e8f5e9",
    borderWidth: 2,
    borderColor: "#4caf50",
  },
  alertIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  alertSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  productSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  productBarcode: {
    fontSize: 12,
    color: "#999",
  },
  allergensSection: {
    padding: 16,
    paddingTop: 0,
  },
  allergenItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ffebee",
    borderRadius: 6,
    marginBottom: 8,
  },
  allergenDot: {
    fontSize: 16,
    color: "#d32f2f",
    marginRight: 8,
  },
  allergenText: {
    fontSize: 15,
    color: "#d32f2f",
    fontWeight: "500",
  },
  ingredientsSection: {
    padding: 16,
    paddingTop: 0,
  },
  ingredientsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expandIcon: {
    fontSize: 14,
    color: "#666",
  },
  ingredientsContent: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  ingredientsText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 20,
  },
  bottomWarning: {
    margin: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginBottom: 32,
  },
  bottomWarningText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
});
