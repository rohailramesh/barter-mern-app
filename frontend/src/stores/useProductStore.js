import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),
  createProduct: async (product) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", product);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "An error occurred - Product could not be created"
      );
      set({ loading: false });
    }
  },
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      console.log(res.data);
      set({ products: res.data.products, loading: false });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "An error occurred - Products could not be fetched"
      );
    }
  },
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.filter(
          (product) => product._id !== productId
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response.data.message ||
          "An error occurred - Product could not be deleted"
      );
    }
  },
  fetchProductByCategory: async (category) => {
    set({ loading: true });
    try {
      const res = await axios.get(`/products/category/${category}`);
      console.log("Inside fetchProductByCategory", res.data);
      set({ products: res.data.products, loading: false });
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "An error occurred - Products could not be fetched"
      );
    }
  },
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/products/${productId}`);
      set((prevProducts) => ({
        products: prevProducts.products.map((product) => {
          if (product._id === productId) {
            return { ...product, isFeatured: !res.data.isFeatured };
          }
          return product;
        }),
      }));
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response.data.message ||
          "An error occurred - Product toggle feature failed"
      );
    }
  },
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products/featured");
      set({ products: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.log(error);
      toast.error(
        error.response.data.message ||
          "An error occurred - Products could not be fetched"
      );
    }
  },
}));
