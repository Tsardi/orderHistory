import axios from 'axios';// for http requests

// Corrected: Consistent constant naming
const API_BASE_URL = 'https://fakestoreapi.com'; // stores the base URL for the fake store api

export interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}// exports the interface defining a product structure


export const fetchProducts = async (category?: string): Promise<Product[]> => {
  const url = category ? `${API_BASE_URL}/products/category/${category}` : `${API_BASE_URL}/products`;
  // Corrected: 'Products[]' to 'Product[]'
  const { data } = await axios.get<Product[]>(url);
  return data;
}; //function to fetch products and optionally categories

export const fetchCategories = async (): Promise<string[]> => {
  const { data } = await axios.get<string[]>(`${API_BASE_URL}/products/categories`);
  return data;
}; // fetches categores