import exampleProduct from "@/exampleProduct.json";
import BarcodeScanner from "@/src/components/BarcodeScanner";
import ProductNameSearch from "@/src/components/ProductNameSearch";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

export default function ProductQuery() {
  const [capturedBarcode, setCapturedBarcode] = useState<string | null>(null);
  const [productData, setProductData] = useState<any>(null);
  const [showProductInfo, setShowProductInfo] = useState(false);
  const scrollRef = React.useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const CARD_WIDTH = width - 32;

  // Effect to load example product when barcode is captured
  useEffect(() => {
    if (capturedBarcode) {
      console.log("Loading example product for barcode:", capturedBarcode);
      // Simulate API delay
      setTimeout(() => {
        setProductData(exampleProduct["Product Info"]);
        console.log("Example product loaded:", exampleProduct["Product Info"]);
      }, 500);
    }
  }, [capturedBarcode]);

  // // Effect to fetch product info when a barcode is captured
  // useEffect(() => {
  //   if (capturedBarcode) {
  //     // Fetch product info when a barcode is captured
  //     console.log("Fetching product info for barcode:", capturedBarcode);
  //     getProductInfo(capturedBarcode)
  //       .then((product) => {
  //         console.log("Product Info:", product);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching product info:", error);
  //       });
  //   }
  // }, [capturedBarcode]);

  useEffect(() => {
    if (productData && scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [productData, width]);

  const handleBarcodeCapture = (barcode: string | null) => {
    setCapturedBarcode(barcode);
  };

  return (
    <View style={[styles.container]}>
      <BarcodeScanner onBarcodeCapture={handleBarcodeCapture} />

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.slider}
      >
        <View style={{ width: CARD_WIDTH, marginLeft: 16 }}>
          <ProductNameSearch />
        </View>

        {productData && (
          <View style={{ width: CARD_WIDTH, marginLeft: 8, marginRight: 16 }}>
            <View style={styles.productInfo}></View>
          </View>
        )}
      </ScrollView>
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
