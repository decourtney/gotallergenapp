import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  getProductInfoByBarcode,
  getProductInfoByName,
} from "../../src/api/openFoodFacts";
import { AllergenResults } from "../../src/components/AllergenResults";
import BarcodeScanner from "../../src/components/BarcodeScanner";
import SearchBar from "../../src/components/SearchBar";
import { COLORS } from "../../src/constants/theme";
import { matchAllergens } from "../../src/utils/allergenMatcher";
import {
  addToSearchHistory,
  AllergenPreferences,
  getAllergenPreferences,
  getScannerMode,
  ScannerMode,
} from "../../src/utils/storageUtils";
// import MyBannerAd from "../../src/components/BannerAd";

export default function Scanner() {
  const params = useLocalSearchParams();
  const [barcode, setBarcode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannerMode, setScannerMode] = useState<ScannerMode>("manual");
  const [userPreferences, setUserPreferences] = useState<AllergenPreferences>(
    {}
  );
  const lastSavedProductRef = useRef<string | null>(null);
  const debounceTimer = useRef<number | null>(null);

  // Handle barcode from navigation params (from history)
  useEffect(() => {
    if (params.barcode && typeof params.barcode === "string") {
      setBarcode(params.barcode);
      setSearchTerm(null);
    } else if (params.productName && typeof params.productName === "string") {
      setSearchTerm(params.productName);
      setBarcode(null);
    }
  }, [params.barcode, params.productName]);

  const loadUserPreferences = async () => {
    const prefs = await getAllergenPreferences();
    setUserPreferences(prefs);
    const mode = await getScannerMode();
    setScannerMode(mode);
  };

  // Reload preferences when screen is focused (in case user changed them)
  useFocusEffect(
    useCallback(() => {
      loadUserPreferences();
    }, [])
  );

  // Handle barcode scan
  const handleBarcodeCapture = useCallback((scannedBarcode: string | null) => {
    if (!scannedBarcode || scannedBarcode.trim() === "") return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setBarcode(scannedBarcode);
      setSearchTerm(null); // Clear search if scanning
    }, 500);
  }, []);

  // Fetch product when barcode or search term changes
  useEffect(() => {
    const fetchProduct = async () => {
      const query = barcode || searchTerm;
      if (!query) return;

      setIsLoading(true);
      setError(null);
      setProduct(null);

      try {
        if (barcode) {
          const productData = await getProductInfoByBarcode(barcode);
          setProduct(productData);
        } else {
          const products = await getProductInfoByName(searchTerm!);
          setProduct(products[0]); // Get first result
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch product.";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [barcode, searchTerm]);

  // Match allergens when product or preferences change
  const allergenMatch = product
    ? matchAllergens(product.allergens_tags, userPreferences)
    : null;

  // Save to history when product is successfully loaded
  useEffect(() => {
    const saveToHistory = async () => {
      if (product && allergenMatch) {
        const productCode = product.code || product._id;

        // Only save if this is a different product than we last saved
        if (productCode && productCode !== lastSavedProductRef.current) {
          const productName =
            product.product_name ||
            product.product_name_en ||
            "Unknown Product";
          const productImage = product.image_url || product.image_front_url;

          await addToSearchHistory({
            productName,
            barcode: product.code,
            allergens: allergenMatch.detectedAllergens,
            imageUrl: productImage,
          });

          lastSavedProductRef.current = productCode;
        }
      }
    };

    saveToHistory();
  }, [product, allergenMatch]);

  return (
    <View style={styles.container}>
      {/* Camera */}
      <BarcodeScanner
        onBarcodeCapture={handleBarcodeCapture}
        mode={scannerMode}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          setSearchTerm={setSearchTerm}
          placeholder="Search for a product..."
        />
      </View>

      {/* Results */}
      <View style={styles.resultsContainer}>
        <AllergenResults
          product={product}
          allergenMatch={allergenMatch}
          isLoading={isLoading}
          error={error}
        />
      </View>

      {/* <MyBannerAd /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    shadowColor: "#00000010",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsContainer: {
    flex: 1,
  },
});
