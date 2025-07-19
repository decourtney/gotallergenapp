import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import BarcodeScanner from '../barcodeScanner'

export default function ProductQuery() {
  const [capturedBarcode, setCapturedBarcode] = useState<string | null>(
    null
  );
  const exmapleBarcodeData = "037466039411"; // Example UPC-A barcode

  const handleBarcodeCapture = (barcode: string) => {
    setCapturedBarcode(barcode);
  };

  return (
    <View style={[styles.container]}>
      <BarcodeScanner onBarcodeCapture={handleBarcodeCapture}/>

      <View style={{height: 200, backgroundColor: "grey"}}>
        <Text style={{color: "white", textAlign: "center", paddingTop: 20}}>
          {capturedBarcode ? `Captured Barcode: ${capturedBarcode}` : "No barcode captured yet."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
  },
});