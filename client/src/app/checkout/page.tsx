"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

type Address = {
  id: string;
  fullName: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
};

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/address", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAddresses(res.data.addresses);

      if (res.data.addresses.length > 0) {
        setSelectedAddress(res.data.addresses[0].id);
      }
    } catch (err) {
      console.error("Error fetching addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!selectedAddress) {
        return alert("Please select an address");
      }

      if (cartItems.length === 0) {
        return alert("Cart is empty");
      }

      //  FIXED ENDPOINT (most likely correct)
      await axios.post(
        "http://localhost:5000/api/orders/checkout",
        {
          addressId: selectedAddress,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order placed successfully 🎉");

      router.push("/orders");
    } catch (err) {
      console.error(err);
      alert("Order failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Checkout
        </h1>

        {loading ? (
          <p className="text-gray-800">Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">

            {/* LEFT — ADDRESS */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Select Address
              </h2>

              {addresses.length === 0 ? (
                <p className="text-gray-700">
                  No addresses found. Please add one.
                </p>
              ) : (
                <div className="space-y-4">

                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition ${
                        selectedAddress === addr.id
                          ? "border-green-600 bg-green-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <p className="font-semibold text-gray-900">
                        {addr.fullName}
                      </p>

                      <p className="text-gray-800">
                        {addr.line1}
                      </p>

                      <p className="text-gray-700">
                        {addr.city}, {addr.state} - {addr.postalCode}
                      </p>

                      <p className="text-gray-700">
                        {addr.phone}
                      </p>
                    </div>
                  ))}

                </div>
              )}

              {/* PAYMENT */}
              <div className="mt-6">

                <h2 className="text-lg font-semibold mb-3 text-gray-900">
                  Payment Method
                </h2>

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border rounded-lg text-gray-900 bg-white"
                >
                  <option value="cod">Cash on Delivery</option>
                  <option value="card">Card (Mock)</option>
                  <option value="upi">UPI (Mock)</option>
                </select>

              </div>

            </div>

            {/* RIGHT — SUMMARY */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-xl font-semibold mb-4 text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-4 max-h-80 overflow-y-auto">

                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between">

                    <span className="text-gray-800">
                      {item.product.name} × {item.quantity}
                    </span>

                    <span className="text-gray-900 font-medium">
                      ₹{item.product.price * item.quantity}
                    </span>

                  </div>
                ))}

              </div>

              <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg text-gray-900">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <button
                onClick={placeOrder}
                className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
              >
                Place Order
              </button>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}