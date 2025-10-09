import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Product } from "../hooks/useProductData";

interface ProductCardProps {
  product: Product;
  width: number;
}

export const ProductCard = ({ product, width }: ProductCardProps) => (
  <View style={{ width }}>
    <View style={styles.productInfo}>
      <Text>
        {product.product_name || product.product_name_en}
        {product._id}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  productInfo: {
    height: "100%",
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5CF27",
    borderRadius: 10,
  },
});
