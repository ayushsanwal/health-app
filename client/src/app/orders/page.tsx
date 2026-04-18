"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    imageUrl?: string;
  };
};

type Address = {
  fullName: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
};

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  address: Address;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data.orders);
    } catch {
      alert("Please login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getEstimatedDelivery = (createdAt: string) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + Math.floor(Math.random() * 5 + 2));
    return date.toDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Your Orders
        </h1>

        {loading ? (
          <p className="text-gray-800">Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-700">No orders yet</p>
        ) : (
          <div className="space-y-8">

            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow p-6"
              >

                {/* HEADER */}
                <div className="flex justify-between flex-wrap gap-4 mb-4">

                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold text-gray-900">
                      {order.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p
                      className={`font-semibold ${
                        order.status === "delivered"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {order.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Payment</p>
                    <p className="font-semibold text-gray-900">
                      Cash on Delivery
                    </p>
                  </div>

                </div>

                {/* ADDRESS */}
                <div className="mb-4 bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">
                    Delivery Address
                  </p>
                  <p className="font-medium text-gray-900">
                    {order.address.fullName}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {order.address.line1}
                  </p>
                  <p className="text-gray-700 text-sm">
                    {order.address.city}, {order.address.state} -{" "}
                    {order.address.postalCode}
                  </p>
                </div>

                {/* ITEMS */}
                <div className="space-y-4">

                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">

                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                          {item.product.imageUrl && (
                            <img
                              src={item.product.imageUrl}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div>
                          <p className="text-gray-900 font-medium">
                            {item.product.name}
                          </p>
                          <p className="text-gray-600 text-sm">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>

                      </div>

                      <p className="font-semibold text-gray-900">
                        ₹{item.price * item.quantity}
                      </p>

                    </div>
                  ))}

                </div>

                {/* FOOTER */}
                <div className="mt-6 border-t pt-4 flex justify-between items-center flex-wrap gap-4">

                  <div>
                    <p className="text-sm text-gray-600">
                      Estimated Delivery
                    </p>
                    <p className="font-medium text-gray-900">
                      {getEstimatedDelivery(order.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{order.total}
                    </p>
                  </div>

                </div>

                {/* TRACK BUTTON */}
                <button
                  onClick={() =>
                    alert("Tracking feature coming soon 🚀")
                  }
                  className="mt-4 w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-black transition"
                >
                  Track Order
                </button>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}