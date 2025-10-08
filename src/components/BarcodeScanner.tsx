import { IconSymbol } from "@/src/components/ui/IconSymbol";
import { ScannerMode } from "@/src/utils/storageUtils";
import { useIsFocused } from "@react-navigation/native";
import {
  BarcodeScanningResult,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
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
  mode?: ScannerMode;
}

export default function BarcodeScanner({
  onBarcodeCapture,
  mode = "manual",
}: BarcodeScannerProps) {
  const insets = useSafeAreaInsets();
  const [facing, setFacing] = useState<CameraType>("back");
  const [isTorch, setIsTorch] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
  const pendingDataRef = useRef<string | null>(null);
  const lastScannedRef = useRef<string | null>(null);
  const isFocused = useIsFocused();
  const FOOD_BARCODE_TYPES = [
    "ean13", // Europe, global
    "ean8", // Smaller retail products
    "upc_a", // US retail
    "upc_e", // Compressed version of UPC-A
  ];

  useEffect(() => {
    if (!isFocused) {
      pendingDataRef.current = null;
      lastScannedRef.current = null;
    }
  }, [isFocused]);

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

    // Store the last scanned barcode for manual mode
    lastScannedRef.current = scanned.data;

    // In auto mode, capture immediately
    if (mode === "auto") {
      if (scanned.data !== pendingDataRef.current && onBarcodeCapture) {
        console.log("Barcode auto-scanned:", scanned.data);
        pendingDataRef.current = scanned.data;
        onBarcodeCapture(scanned.data);
      }
    }
  };

  const handleManualScan = () => {
    if (mode === "manual" && lastScannedRef.current) {
      // Only capture if we have a barcode and it's different from the last one captured
      if (
        lastScannedRef.current !== pendingDataRef.current &&
        onBarcodeCapture
      ) {
        console.log("Barcode manually captured:", lastScannedRef.current);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        pendingDataRef.current = lastScannedRef.current;
        onBarcodeCapture(lastScannedRef.current);
      }
    }
  };

  return (
    <View style={[styles.container]}>
      {isFocused && (
        <TouchableWithoutFeedback
          style={[styles.container]}
          onPress={handleManualScan}
        >
          <CameraView
            key={facing} // also remount when switching camera type
            style={[styles.camera]}
            facing={facing}
            enableTorch={isTorch}
            onBarcodeScanned={onBarCodeScanned}
          />
        </TouchableWithoutFeedback>
      )}

      <View style={[styles.cameraUI]}>
        <View
          style={{ height: insets.top, backgroundColor: "rgba(0,0,0,0.2)" }}
        ></View>

        <View style={[{ flex: 1, position: "relative" }]}>
          {/* Manual Mode Indicator */}
          {mode === "manual" && (
            <View style={styles.manualModeIndicator}>
              <Text style={styles.manualModeText}>Tap to scan</Text>
            </View>
          )}
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
            onPress={() => setIsTorch(isTorch === false ? true : false)}
          >
            {isTorch === false ? (
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
    minHeight: "35%",
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
  manualModeIndicator: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  manualModeText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13,
    fontWeight: "500",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
