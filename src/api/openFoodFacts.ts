// API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL!;
const API_USER_AGENT = process.env.EXPO_PUBLIC_API_USER_AGENT!;
const AUTH_USER = process.env.EXPO_PUBLIC_API_AUTH_USER!;
const AUTH_PASS = process.env.EXPO_PUBLIC_API_AUTH_PASS!;

// Helper function to make API calls with custom headers
const apiCall = async (endpoint: string) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "User-Agent": API_USER_AGENT,
      // Authorization: "Basic " + btoa(`${AUTH_USER}:${AUTH_PASS}`), // For testing on .net url
    },
  });
  console.log("Making an API call.")

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Product not found");
    }
    throw new Error(`Unable to connect to product database`);
  }

  return response.json();
};

// Get product info by barcode
export const getProductInfoByBarcode = async (barcode: string) => {
  try {
    const data = await apiCall(`/product/${barcode}.json`);

    if (data.status === 1) {
      return data.product;
    } else {
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error("Error fetching product info:", error);
    throw error;
  }
};

// Get product info by name
export const getProductInfoByName = async (name: string) => {
  try {
    const data = await apiCall(
      `/search?search_terms=${encodeURIComponent(name)}`
    );

    if (data.count > 0) {
      return data.products;
    } else {
      throw new Error("No products found");
    }
  } catch (error) {
    console.error("Error fetching products by name:", error);
    throw error;
  }
};
