import { useState, useEffect, useRef, useCallback } from "react";
import exampleProduct from "@/exampleProduct.json";
import { getProductInfoByBarcode } from "../api/openFoodFacts";
// import { getProductInfo } from "@/src/api/openFoodFacts";

export const useProductFetch = (
  barcode: string,
  onProductLoaded: (product: any) => void
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for empty barcode or already processed
    if (!barcode || barcode.trim() === "") {
      console.log("Skipping fetch - empty barcode:", barcode);
      return;
    }

    const fetchProduct = async () => {
      // Mark barcode as being processed
      setIsLoading(true);
      setError(null);

      try {
        console.log("Loading product for barcode:", barcode);

        // Simulate API delay - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        const product = { ...exampleProduct["Product Info"] };

        // For real API, use:
        // const product = await getProductInfoByBarcode(barcode);

        console.log(
          "Product loaded:",
          product.product_name || product.product_name_en
        );

        // Let parent handle adding to state
        onProductLoaded(product);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch product";
        console.error("Error fetching product:", errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [barcode]); // Clean dependency - just the barcode

  // Method to clear processed barcodes (useful for reset)
  // const clearProcessedBarcodes = useCallback(() => {
  //   processedBarcodesRef.current.clear();
  // }, []);

  return { isLoading, error };
};
