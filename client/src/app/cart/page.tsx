"use client";

import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import axios from "axios";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
};

export default function CartPage() {
  const { cartItems, removeItem } = useCart(); // ✅ GLOBAL STATE
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const router = useRouter();

  const fetchRecommendations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");

      const sorted = res.data.products
        .sort((a: any, b: any) => b.rating - a.rating)
        .slice(0, 4);

      setRecommendations(sorted);
    } catch {
      console.error("Error fetching recommendations");
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-gray-700">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-6">

              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white p-5 rounded-xl shadow flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">

                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                      {item.product.imageUrl && (
                        <img
                          src={item.product.imageUrl}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {item.product.name}
                      </h2>
                      <p className="text-gray-700">
                        ₹{item.product.price} × {item.quantity}
                      </p>
                    </div>

                  </div>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-red-600 font-medium hover:underline"
                  >
                    Remove
                  </button>

                </div>
              ))}

              {/* TOTAL */}
              <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">

                <h2 className="text-xl font-bold text-gray-900">
                  Total: ₹{total}
                </h2>

                <button
                  onClick={() => router.push("/checkout")}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                >
                  Proceed to Checkout
                </button>

              </div>

            </div>

            {/* RECOMMENDATIONS */}
            <div className="mt-12">

              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                You may also like
              </h2>

              <div className="grid md:grid-cols-4 gap-6">

                {recommendations.map((p) => (
                  <div key={p.id} className="bg-white p-4 rounded-xl shadow">
                    <img
                      src={p.imageUrl}
                      className="h-32 w-full object-cover rounded"
                    />

                    <h3 className="mt-2 font-semibold text-gray-900 text-sm">
                      {p.name}
                    </h3>

                    <p className="text-green-600 font-bold">
                      ₹{p.price}
                    </p>
                  </div>
                ))}

              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}