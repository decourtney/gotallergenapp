import { getProductInfo } from "@/src/api/openFoodFacts";
import BarcodeScanner from "@/src/components/BarcodeScanner";
import ProductNameSearch from "@/src/components/ProductNameSearch";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import exampleProduct from "@/exampleProduct.json"; // Adjust the path as necessary

export default function ProductQuery() {
  const [capturedBarcode, setCapturedBarcode] = useState<string | null>(null);
  const [productData, setProductData] = useState<any[]>([]);
  const flatListRef = React.useRef<FlatList>(null);
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width - 32;

  // Effect to load example product when barcode is captured
  useEffect(() => {
    if (capturedBarcode) {
      console.log("Loading example product for barcode:", capturedBarcode);
      // Simulate API delay
      setTimeout(() => {
        const newProduct = {
          ...exampleProduct["Product Info"],
          id: capturedBarcode, // Use barcode as unique ID
          barcode: capturedBarcode,
        };
        setProductData((prevData) => [...prevData, newProduct]);
        console.log(
          "Example product loaded:",
          exampleProduct["Product Info"]["product_name"]
        );
      }, 500);
    }
  }, [capturedBarcode]);

  // Effect to fetch product info when a barcode is captured
  // useEffect(() => {
  //   if (capturedBarcode) {
  //     // Fetch product info when a barcode is captured
  //     console.log("Fetching product info for barcode:", capturedBarcode);
  //     getProductInfo(capturedBarcode)
  //       .then((product) => {
  //         setProductData((prevData) => [...prevData, product]);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching product info:", error);
  //       });
  //   }
  // }, [capturedBarcode]);

  // Effect to scroll to the last product when new data is added
  useEffect(() => {
    if (flatListRef.current && productData.length > 0) {
      const lastIndex = productData.length;
      flatListRef.current.scrollToIndex({
        index: lastIndex,
        animated: true,
      });
    }
  }, [productData]);

  const handleBarcodeCapture = (barcode: string | null) => {
    setCapturedBarcode(barcode);
  };

  return (
    <View style={[styles.container]}>
      <BarcodeScanner onBarcodeCapture={handleBarcodeCapture} />

      <FlatList
        ref={flatListRef}
        style={[styles.slider, { backgroundColor: "#27F2F5" }]}
        data={[{ type: "search" }, ...productData]}
        keyExtractor={(item, index) =>
          item.type === "search" ? "search" : item["_id"] || index.toString()
        }
        horizontal
        pagingEnabled
        snapToAlignment="center"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
        // scrollToIndex doesnt work without getItemLayout
        getItemLayout={(data, index) => ({
          length: CARD_WIDTH + 8, // card width + separator width
          offset: (CARD_WIDTH + 8) * index,
          index,
        })}
        renderItem={({ item, index }) => {
          if (item.type === "search") {
            return (
              <View style={{ width: CARD_WIDTH }}>
                <ProductNameSearch />
              </View>
            );
          }

          return (
            <View style={{ width: CARD_WIDTH }}>
              <View style={styles.productInfo}>
                <Text>
                  {item["product_name"]}
                  {item["_id"]}
                </Text>
              </View>
            </View>
          );
        }}
      />
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
  productInfo: {
    height: "100%",
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5CF27",
    borderRadius: 10,
  },
});
