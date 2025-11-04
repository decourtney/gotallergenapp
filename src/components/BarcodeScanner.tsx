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
import { IconSymbol } from "../../src/components/ui/IconSymbol";
import { COLORS } from "../../src/constants/theme";
import { ScannerMode } from "../../src/utils/storageUtils";

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
        <Button
          onPress={requestPermission}
          title="Grant Permission"
          color={COLORS.primary}
        />
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
    if (mode === "auto" && onBarcodeCapture) {
      if (scanned.data == pendingDataRef.current) return;

      pendingDataRef.current = scanned.data;
      onBarcodeCapture(scanned.data);
    }
  };

  const handleManualScan = () => {
    console.log("handlemanualscan:", lastScannedRef.current);
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
          style={{ height: insets.top, backgroundColor: COLORS.overlay }}
        ></View>

        <View style={[{ flex: 1, position: "relative" }]}>
          {/* Manual Mode Indicator */}
          {mode === "manual" && (
            <View style={styles.manualModeIndicator}>
              <Text style={styles.manualModeText}>👆 Tap to scan</Text>
            </View>
          )}

          {/* Frame Corners */}
          <View style={[styles.frameCorner, styles.topLeft, styles.noClick]} />
          <View style={[styles.frameCorner, styles.topRight, styles.noClick]} />
          <View
            style={[styles.frameCorner, styles.bottomLeft, styles.noClick]}
          />
          <View
            style={[styles.frameCorner, styles.bottomRight, styles.noClick]}
          />

          {/* Center Search Icon */}
          <View style={[styles.button, styles.searchButton, styles.noClick]}>
            <IconSymbol size={28} name="search-sharp" color={COLORS.white} />
          </View>

          {/* Camera Control Buttons */}
          <TouchableHighlight
            style={[styles.button, styles.reverseButton]}
            underlayColor={COLORS.clear}
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
          >
            <View style={styles.controlButtonInner}>
              <IconSymbol
                size={24}
                name="camera-reverse-sharp"
                color={COLORS.white}
              />
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            style={[styles.button, styles.flashButton]}
            underlayColor={COLORS.clear}
            onPress={() => setIsTorch(isTorch === false ? true : false)}
          >
            <View style={styles.controlButtonInner}>
              {isTorch === false ? (
                <IconSymbol size={24} name="flash-sharp" color={COLORS.white} />
              ) : (
                <IconSymbol
                  size={24}
                  name="flash-off-sharp"
                  color={COLORS.white}
                />
              )}
            </View>
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
  message: {
    textAlign: "center",
    paddingBottom: 16,
    fontSize: 16,
    color: "#333",
    paddingHorizontal: 32,
  },
  noClick: {
    pointerEvents: "none",
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
    opacity: 1,
  },
  controlButtonInner: {
    padding: 12,
  },
  searchButton: {
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
    padding: 16,
  },
  reverseButton: {
    bottom: 16,
    left: 16,
  },
  flashButton: {
    bottom: 16,
    right: 16,
  },
  frameCorner: {
    position: "absolute",
    width: 24,
    height: 24,
    opacity: 1,
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: 16,
    left: 16,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 16,
    right: 16,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 16,
    left: 16,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 16,
    right: 16,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 12,
  },
  manualModeIndicator: {
    position: "absolute",
    top: 24,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  manualModeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "600",
    // backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 1,
  },
});
