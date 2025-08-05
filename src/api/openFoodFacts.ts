import axios from "axios";

// Create axios instance with custom user-agent and basic auth for staging
const api = axios.create({
  baseURL: "https://world.openfoodfacts.net/api/v2",
  headers: {
    "User-Agent": "NativeFoodNutritionScanner/0.1 (donovan.courtney@gmail.com)",
    Authorization: "Basic " + btoa("off:off"),
  },
});

// Get product info by barcode
export const getProductInfoByBarcode = async (barcode: string) => {
  try {
    const response = await api.get(`/product/${barcode}.json`);

    if (response.data.status === 1) {
      return response.data.product;
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error("Error fetching product info:", error);
    throw error;
  }
};

export const getProductInfoByName = async (name: string) => {
  try {
    const response = await api.get(`/search/${name}`);

    if (response.data.count > 0) {
      return response.data.products;
    } else {
      throw new Error("No products found");
    }
  } catch (error) {
    console.error("Error fetching products by name:", error);
    throw error;
  }
};
