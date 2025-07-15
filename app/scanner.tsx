import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Scanner() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const pendingDataRef = useRef<string | null>(null);
  const FOOD_BARCODE_TYPES = [
    "ean13", // Europe, global
    "ean8", // Smaller retail products
    "upc_a", // US retail
    "upc_e", // Compressed version of UPC-A
  ];

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const onBarCodeScanned = (scanned: BarcodeScanningResult) => {
    if (!FOOD_BARCODE_TYPES.includes(scanned.type)) {
      console.warn("Unsupported barcode type:", scanned.type);
      return;
    }

    if (scanned.data !== pendingDataRef.current) {
      pendingDataRef.current = scanned.data;
    }
  };

  const handleManualScan = () => {
    const current = pendingDataRef.current;
    if (current) {
      console.log("User confirmed:", current);
      // Store or process current barcode
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={onBarCodeScanned}
      >
        <TouchableOpacity style={styles.scanButton} onPress={handleManualScan}>
          <Text style={styles.scanButtonText}>Scan Now</Text>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  scanButton: {
    position: "absolute",
    bottom: 200,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },

  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
