import BarcodeScanner from "@/src/components/BarcodeScanner";
import { ProductCard } from "@/src/components/ProductCard";
import ProductNameSearch from "@/src/components/ProductNameSearch";
import { useFlatListScroll } from "@/src/hooks/useFlatListScroll";
import { useProductData } from "@/src/hooks/useProductData";
import { useProductFetch } from "@/src/hooks/useProductFetch";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

const SEARCH_CARD_OFFSET = 1; // Account for search card at index 0

export default function ProductQuery() {
  const [capturedBarcode, setCapturedBarcode] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width - 32;

  // Custom hooks
  const { products, addProduct, clearProducts, findProductByBarcode } =
    useProductData();
  const { flatListRef, scrollToIndex, resetScroll } = useFlatListScroll();

  // Memoize the callback to prevent useEffect re-runs
  const handleProductLoaded = useCallback(
    (product: any) => {
      const result = addProduct(product);

      if (result.isNew) {
        console.log(
          "Adding new product:",
          product.product_name || product.product_name_en
        );
        // Scroll to new item after state update
        setTimeout(() => scrollToIndex(result.index + SEARCH_CARD_OFFSET), 0);
      } else {
        console.log("Product already exists, scrolling to existing item");
        scrollToIndex(result.index + SEARCH_CARD_OFFSET);
      }

      return result;
    },
    [addProduct, scrollToIndex]
  );

  // Handle barcode capture with validation
  const handleBarcodeCapture = useCallback(
    (barcode: string | null) => {
      console.log("Barcode captured:", barcode);

      // Only process valid barcodes
      if (!barcode || barcode.trim() === "") return;

      // Check if product already exists
      const existingProduct = findProductByBarcode(barcode);
      if (existingProduct.exists) {
        console.log("Product already exists, scrolling to existing item");
        scrollToIndex(existingProduct.index + SEARCH_CARD_OFFSET);
        return;
      }

      // New barcode - proceed with fetch
      setCapturedBarcode(barcode);
    },
    [findProductByBarcode, scrollToIndex]
  );

  // Fetch product when barcode changes (only called with valid barcodes)
  const { isLoading, error } = useProductFetch(
    capturedBarcode || "", // This ensures we pass a string, but empty string is handled in the hook
    handleProductLoaded
  );

  // Clear data when navigating away from this screen
  useFocusEffect(
    useCallback(() => {
      console.log("ProductQuery screen focused");

      return () => {
        console.log("ProductQuery screen unfocused - clearing data");
        clearProducts();
        setCapturedBarcode(null);
        resetScroll();
      };
    }, [clearProducts, resetScroll])
  );

  // Prepare data for FlatList
  const flatListData = [{ type: "search" }, ...products];

  return (
    <View style={styles.container}>
      <BarcodeScanner onBarcodeCapture={handleBarcodeCapture} />

      <FlatList
        ref={flatListRef}
        style={[styles.slider, { backgroundColor: "#27F2F5" }]}
        data={flatListData}
        keyExtractor={(item, index) =>
          item.type === "search" ? "search" : item._id || index.toString()
        }
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH + 8,
          offset: (CARD_WIDTH + 8) * index,
          index,
        })}
        renderItem={({ item }) => {
          if (item.type === "search") {
            return (
              <View style={{ width: CARD_WIDTH }}>
                <ProductNameSearch />
              </View>
            );
          }

          return <ProductCard product={item} width={CARD_WIDTH} />;
        }}
      />

      {/* Debug info - remove in production */}
      {__DEV__ && (
        <View style={styles.debugInfo}>
          <Text>Products: {products.length}</Text>
          <Text>Loading: {isLoading ? "Yes" : "No"}</Text>
          <Text>Error: {error || "None"}</Text>
          <Text>Barcode: {capturedBarcode || "None"}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
  },
  slider: {
    flexDirection: "row",
    maxHeight: 200,
  },
  debugInfo: {
    padding: 8,
    backgroundColor: "#f0f0f0",
    margin: 8,
    borderRadius: 4,
  },
});
