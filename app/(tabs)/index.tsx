import { AllergenResults } from "@/src/components/AllergenResults";
import BarcodeScanner from "@/src/components/BarcodeScanner";
import SearchBar from "@/src/components/SearchBar";
import { matchAllergens } from "@/src/utils/allergenMatcher";
import {
  addToSearchHistory,
  AllergenPreferences,
  getAllergenPreferences,
  getScannerMode,
  ScannerMode,
} from "@/src/utils/storageUtils";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

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

  // // Load user preferences on mount
  // useEffect(() => {
  //   loadUserPreferences();
  //   setProduct(null);
  // }, []);

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
    setBarcode(scannedBarcode);
    setSearchTerm(null); // Clear search if scanning
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
        let url: string;

        if (barcode) {
          // Fetch by barcode
          url = `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`;
        } else {
          // Search by product name
          url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
            searchTerm!
          )}&page_size=1&json=true`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (barcode) {
          // Barcode lookup response
          if (data.status === 1 && data.product) {
            setProduct(data.product);
          } else {
            setError("Product not found. Please try another barcode.");
          }
        } else {
          // Search response
          if (data.products && data.products.length > 0) {
            setProduct(data.products[0]);
          } else {
            setError("No products found. Try a different search term.");
          }
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product. Please check your connection.");
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  resultsContainer: {
    flex: 1,
  },
});
