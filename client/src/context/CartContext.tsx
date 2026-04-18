"use client";

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type CartItem = {
  productId: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    imageUrl?: string;
  };
};

type CartContextType = {
  cartItems: CartItem[];
  fetchCart: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const getToken = () => localStorage.getItem("token");

  const fetchCart = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(res.data.cart);
    } catch (err) {
      console.error("Cart fetch error");
    }
  };

  const addItem = async (productId: string) => {
    try {
      const token = getToken();
      if (!token) return alert("Login required");

      await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchCart(); // 🔥 auto refresh everywhere
    } catch {
      console.error("Add failed");
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const token = getToken();

      await axios.delete("http://localhost:5000/api/cart/remove", {
        data: { productId, quantity: 1 },
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchCart(); // 🔥 auto refresh everywhere
    } catch {
      console.error("Remove failed");
    }
  };

  useEffect(() => {
    fetchCart(); // initial load
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, fetchCart, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("CartContext not found");
  return context;
};