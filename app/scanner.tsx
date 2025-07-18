import { IconSymbol } from "@/components/ui/IconSymbol";
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
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Scanner() {
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

  const exmapleBarcodeData = "037466039411"; // Example UPC-A barcode

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
    <View style={[styles.container]}>
      <CameraView
        style={[styles.camera]}
        facing={facing}
        flash={flashMode}
        onBarcodeScanned={onBarCodeScanned}
      >
        <View
          style={{ height: insets.top, backgroundColor: "rgba(0,0,0,0.2)" }}
        ></View>
        <View style={{ flex: 1 }}>
          {/* Top Left Corner */}
          <View style={[styles.cornerFrame, styles.topLeft]} />

          {/* Top Right Corner */}
          <View style={[styles.cornerFrame, styles.topRight]} />

          {/* Bottom Left Corner */}
          <View style={[styles.cornerFrame, styles.bottomLeft]} />

          {/* Bottom Right Corner */}
          <View style={[styles.cornerFrame, styles.bottomRight]} />

          <View style={[styles.icon, styles.searchIcon]}>
            <IconSymbol size={28} name="search-sharp" color="white" />
          </View>

          <TouchableHighlight
            style={[styles.icon, styles.reverseIcon]}
            underlayColor={"rgba(255, 255, 255, 0.2)"}
            onPress={() => setFacing(facing === "back" ? "front" : "back")}
          >
            <IconSymbol size={20} name="camera-reverse-sharp" color="white" />
          </TouchableHighlight>

          <TouchableHighlight
            style={[styles.icon, styles.flashIcon]}
            underlayColor={"rgba(255, 255, 255, 0.2)"}
            onPress={() => setFlashMode(flashMode === "off" ? "on" : "off")}
          >
            {flashMode === "off" ? (
              <IconSymbol size={20} name="flash-sharp" color="white" />
            ) : (
              <IconSymbol size={20} name="flash-off-sharp" color="white" />
            )}
          </TouchableHighlight>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    height: "35%",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  icon: {
    position: "absolute",
    padding: 10,
    opacity:1,
    borderRadius: "100%",
  },
  searchIcon: {
    top: "50%",
    left: "50%",
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
  },
  reverseIcon: {
    bottom: 10,
    left: 10,
  },
  flashIcon: {
    bottom: 10,
    right: 10,
  },
  cornerFrame: {
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
