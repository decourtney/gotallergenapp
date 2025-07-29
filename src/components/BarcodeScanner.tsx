import { IconSymbol } from "@/src/components/ui/IconSymbol";
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { useRef, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BarcodeScannerProps {
  onBarcodeCapture?: (barcode: string | null) => void;
}

export default function BarcodeScanner({
  onBarcodeCapture,
}: BarcodeScannerProps) {
  const insets = useSafeAreaInsets();
  const [facing, setFacing] = useState<CameraType>("back");
  const [flashMode, setFlashMode] = useState<"off" | "on">("off");
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
      <View
        style={[
          styles.container,
          { flex: 1, justifyContent: "center", height: "100%" },
        ]}
      >
        <Text style={styles.message}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const onBarCodeScanned = (scanned: BarcodeScanningResult) => {
    // Check if the scanned barcode type is one of the supported types
    if (!FOOD_BARCODE_TYPES.includes(scanned.type)) {
      console.warn("Unsupported barcode type:", scanned.type);
      return;
    }

    // If the scanned data is different from the pending data, update it
    if (scanned.data !== pendingDataRef.current && onBarcodeCapture) {
      console.log("Barcode scanned:", scanned.data);
      pendingDataRef.current = scanned.data;
      onBarcodeCapture(scanned.data);
    }
  };

  const handleManualScan = () => {
    // // Clear the pending data and notify the parent component
    // pendingDataRef.current = null;
    // if (onBarcodeCapture) {
    //   onBarcodeCapture(null); // Clear the captured barcode
    // }

    // Simulate a manual scan for demonstration purposes
    // Example UPC-A barcode 037466039411
    if (onBarcodeCapture) {
      onBarcodeCapture("037466039411"); // Simulate a manual scan
    }
  };

  return (
    <View style={[styles.container]}>
      <TouchableWithoutFeedback
        style={[styles.container]}
        onPress={handleManualScan}
      >
        <CameraView
          style={[styles.camera]}
          facing={facing}
          flash={flashMode}
          onBarcodeScanned={onBarCodeScanned}
        ></CameraView>
      </TouchableWithoutFeedback>

      <View style={[styles.cameraUI]}>
        <View
          style={{ height: insets.top, backgroundColor: "rgba(0,0,0,0.2)" }}
        ></View>

        <View style={[{ flex: 1, position: "relative" }]}>
          {/* Top Left Corner */}
          <View style={[styles.frameCorner, styles.topLeft, styles.noClick]} />
          {/* Top Right Corner */}
          <View style={[styles.frameCorner, styles.topRight, styles.noClick]} />
          {/* Bottom Left Corner */}
          <View
            style={[styles.frameCorner, styles.bottomLeft, styles.noClick]}
          />
          {/* Bottom Right Corner */}
          <View
            style={[styles.frameCorner, styles.bottomRight, styles.noClick]}
          />

          <View style={[styles.button, styles.searchButton, styles.noClick]}>
            <IconSymbol size={28} name="search-sharp" color="white" />
          </View>

          {/* Camera buttons */}
          <TouchableHighlight
            style={[styles.button, styles.reverseButton]}
            underlayColor={"rgba(255, 255, 255, 0.2)"}
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
          >
            <IconSymbol size={28} name="camera-reverse-sharp" color="white" />
          </TouchableHighlight>
          <TouchableHighlight
            style={[styles.button, styles.flashButton]}
            underlayColor={"rgba(255, 255, 255, 0.2)"}
            onPress={() => setFlashMode(flashMode === "off" ? "on" : "off")}
          >
            {flashMode === "off" ? (
              <IconSymbol size={28} name="flash-sharp" color="white" />
            ) : (
              <IconSymbol size={28} name="flash-off-sharp" color="white" />
            )}
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    maxHeight: "35%",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  noClick: {
    pointerEvents: "none",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    height: "100%",
  },
  cameraUI: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    padding: 10,
    opacity: 1,
    borderRadius: "100%",
  },
  searchButton: {
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
  },
  reverseButton: {
    bottom: 10,
    left: 10,
  },
  flashButton: {
    bottom: 10,
    right: 10,
  },
  frameCorner: {
    position: "absolute",
    width: 20,
    height: 20,
    opacity: 1,
    borderColor: "white", // or use Colors.light.tint for theme consistency
    borderWidth: 2,
  },
  topLeft: {
    top: 10,
    left: 10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 10,
    right: 10,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 10,
    left: 10,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 10,
    right: 10,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
