"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  rating: number;
  category: string;
};

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [sortOption, setSortOption] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // 🔥 GLOBAL CART
  const { cartItems, addItem, removeItem } = useCart();

  // 🔥 CREATE MAP FROM CONTEXT
  const cartMap: Record<string, number> = {};
  cartItems.forEach((item) => {
    cartMap[item.productId] = item.quantity;
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const res = await axios.get(
            "http://localhost:5000/api/recommendations",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setProducts(res.data.recommendations);
        } else {
          const res = await axios.get("http://localhost:5000/api/products");

          const sorted = res.data.products.sort(
            (a: Product, b: Product) => b.rating - a.rating
          );

          setProducts(sorted);
        }
      } catch (error) {
        console.error("ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((p) =>
      categoryFilter ? p.category === categoryFilter : true
    )
    .sort((a, b) => {
      if (sortOption === "priceLow") return a.price - b.price;
      if (sortOption === "priceHigh") return b.price - a.price;
      if (sortOption === "ratingHigh") return b.rating - a.rating;
      if (sortOption === "ratingLow") return a.rating - b.rating;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-green-50 to-gray-200 pt-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Explore Products
        </h1>

        {/* FILTERS */}
        <div className="flex gap-4 mb-8">

          <select
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border rounded-lg bg-white text-gray-900 font-medium shadow-sm"
          >
            <option value="">All Categories</option>
            <option value="equipment">Equipment</option>
            <option value="supplement">Supplement</option>
            <option value="accessory">Accessory</option>
          </select>

          <select
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border rounded-lg bg-white text-gray-900 font-medium shadow-sm"
          >
            <option value="">Sort By</option>
            <option value="priceLow">Price Low</option>
            <option value="priceHigh">Price High</option>
            <option value="ratingHigh">Rating High</option>
            <option value="ratingLow">Rating Low</option>
          </select>

        </div>

        {loading ? (
          <p className="text-gray-700">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">

            {filteredProducts.map((p) => {
              const qty = cartMap[p.id] || 0;

              return (
                <div key={p.id} className="bg-white p-5 rounded-2xl shadow">

                  <img
                    src={p.imageUrl}
                    className="h-48 w-full object-cover rounded"
                  />

                  <h2 className="mt-3 font-semibold text-gray-900">
                    {p.name}
                  </h2>

                  <p className="text-green-600 font-bold">
                    ₹{p.price}
                  </p>

                  <p className="text-yellow-500">⭐ {p.rating}</p>

                  {qty === 0 ? (
                    <button
                      onClick={() => addItem(p.id)}
                      className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex justify-between items-center mt-3">

                      <button
                        onClick={() => removeItem(p.id)}
                        className="px-3 py-1 bg-gray-200 text-gray-900 rounded hover:bg-gray-300"
                      >
                        -
                      </button>

                      <span className="font-semibold text-gray-900 text-lg">
                        {qty}
                      </span>

                      <button
                        onClick={() => addItem(p.id)}
                        className="px-3 py-1 bg-gray-200 text-gray-900 rounded hover:bg-gray-300"
                      >
                        +
                      </button>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
}