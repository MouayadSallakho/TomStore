export const API_BASE = "https://dummyjson.com";

export const ENDPOINTS = {
  productsByCategory: (category) => `${API_BASE}/products/category/${category}`,
};