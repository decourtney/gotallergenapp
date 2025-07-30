import { useCallback, useRef, useState } from "react";

export interface Product {
  _id: string;
  product_name: string;
  [key: string]: any;
}

export const useProductData = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const barcodeToIndexRef = useRef<Map<string, number>>(new Map());

  const addProduct = useCallback(
    (product: Product): { isNew: boolean; index: number } => {
      let result = { isNew: false, index: -1 };

      setProducts((prevProducts) => {
        // Check if product already exists in the list
        const existingIndex = prevProducts.findIndex(
          (p) => p._id === product._id
        );

        if (existingIndex >= 0) {
          // Product exists
          result = { isNew: false, index: existingIndex };
          return prevProducts;
        } else {
          // New product
          const newProducts = [...prevProducts, product];
          result = { isNew: true, index: newProducts.length - 1 };
          barcodeToIndexRef.current.set(product._id, newProducts.length - 1);
          return newProducts;
        }
      });

      return result;
    },
    []
  );

  const findProductByBarcode = useCallback((barcode: string) => {
    const index = barcodeToIndexRef.current.get(barcode);
    return index !== undefined
      ? { exists: true, index }
      : { exists: false, index: -1 };
  }, []);

  const clearProducts = useCallback(() => {
    setProducts([]);
    barcodeToIndexRef.current.clear();
  }, []);

  return {
    products,
    addProduct,
    clearProducts,
    findProductByBarcode,
  };
};
