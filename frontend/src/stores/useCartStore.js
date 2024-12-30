import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subTotal: 0,
  isCouponApplied: false,

  getMyCoupon: async () => {
    try {
      const res = await axios.get("/coupons");
      set({ coupon: res.data });
    } catch (error) {
      toast.error(error.response.data.message || "Coupon not found");
    }
  },
  applyCoupon: async (code) => {
    try {
      const res = await axios.post("/coupons/validate", { code });
      set({ coupon: res.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response.data.message || "Coupon could not be applied");
    }
  },
  removeCoupon: async () => {
    try {
      set({ coupon: null, isCouponApplied: false });
      get().calculateTotals();
      toast.success("Coupon removed successfully");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subTotal: 0 });
  },
  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart");
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) => {
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item;
            })
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(
        error.response.data.message || "Item could not be added to cart"
      );
    }
  },
  removeFromCart: async (productId) => {
    try {
      await axios.delete(`/cart`, { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
      toast.success("Product removed from cart");
    } catch (error) {
      toast.error(
        error.response.data.message || "Item could not be removed from cart"
      );
    }
  },
  updateQuantity: async (product, quantity) => {
    try {
      if (quantity === 0) {
        get().removeFromCart(productId);
        return;
      }
      await axios.put(`/cart/${productId}`, { quantity });
      set((prevState) => ({
        cart: prevState.cart.map((item) => {
          if (item._id === productId) {
            return { ...item, quantity };
          }
          return item;
        }),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "Item could not be updated");
    }
  },
  calculateTotals: () => {
    const { cart, coupon } = get();
    const subTotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subTotal;
    if (coupon) {
      const discount = subTotal * (coupon.discountPercentage / 100);
      total = subTotal - discount;
    }
    set({ subTotal, total });
  },
}));
