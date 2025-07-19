import BarcodeScanner from "@/src/components/BarcodeScanner";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
  import exampleProduct from "@/exampleProduct.json";

export default function ProductQuery() {
  const [capturedBarcode, setCapturedBarcode] = useState<string | null>(null);
  const [productData, setProductData] = useState<any>(null);

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

  const handleBarcodeCapture = (barcode: string | null) => {
    setCapturedBarcode(barcode);
  };

  return (
    <View style={[styles.container]}>
      <BarcodeScanner onBarcodeCapture={handleBarcodeCapture} />

      <View style={{ height: 200, backgroundColor: "grey" }}>
        <Text style={{ color: "white", textAlign: "center", paddingTop: 20 }}>
          {capturedBarcode
            ? `Captured Barcode: ${capturedBarcode}`
            : "No barcode captured yet."}
        </Text>

        {productData && (
          <Text style={{ color: "white", textAlign: "center", paddingTop: 10 }}>
            Product: {productData.product_name}
          </Text>
        )}

        <Button
          title="Clear"
          onPress={() => {
            setCapturedBarcode(null);
            setProductData(null);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
  },
});
