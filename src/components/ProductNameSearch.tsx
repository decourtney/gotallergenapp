import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SearchBar from "../components/SearchBar";

export default function ProductNameSearch() {
  const [query, setQuery] = useState("");

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
      <SearchBar value={query} onChange={setQuery} />
      {/* Render query results here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "25%",
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 10,
  },
  text:{
    fontSize: 16,
    textAlign: "center",
    fontWeight: "400"
  },
  textBold: {
    fontWeight: "800",
  },
});
