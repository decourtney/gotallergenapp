import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SearchBar from "../components/SearchBar";

export default function ProductNameSearch() {
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm) {
      // send search term to productQuery.tsx
      console.log("Search term updated:", searchTerm);
    }
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>
          <Text style={styles.textBold}>Scan</Text> a barcode or
        </Text>
        <Text style={styles.text}>
          <Text style={styles.textBold}>search</Text> for a product
        </Text>
      </View>
      <SearchBar setSearchTerm={setSearchTerm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "400",
  },
  textBold: {
    fontWeight: "800",
  },
});
