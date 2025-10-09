import { View, StyleSheet } from "react-native";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";

export default function MyBannerAd() {
  return (
    <BannerAd
      unitId={"ca-app-pub-3979426636844775/3588162963"}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        networkExtras: {
          collapsible: "bottom",
        },
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
