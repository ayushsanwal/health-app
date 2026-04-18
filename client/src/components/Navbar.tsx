"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  // 🔥 GLOBAL CART
  const { cartItems, addItem, removeItem } = useCart();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  // CLOSE DROPDOWN
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }

      if (
        cartRef.current &&
        !cartRef.current.contains(event.target as Node)
      ) {
        setCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <nav className="w-full flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 z-50">

      {/* LOGO */}
      <h1 className="text-xl font-bold text-green-600">HealthApp</h1>

      {/* LINKS */}
      <div className="flex gap-6 text-gray-700 font-medium">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/bmi">BMI</Link>
        <Link href="/meal">Meal Plan</Link>
        <Link href="/marketplace">Marketplace</Link>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* 🛍️ CART */}
        {isLoggedIn && (
          <div className="relative" ref={cartRef}>

            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative text-2xl text-gray-800 hover:text-green-600"
            >
              <FaShoppingBag />

              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>

            {/* DROPDOWN */}
            {cartOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white text-gray-900 rounded-xl shadow-lg border z-50 p-4">

                <h3 className="font-semibold text-gray-900 mb-3">
                  Your Cart
                </h3>

                {cartItems.length === 0 ? (
                  <p className="text-gray-600 text-sm">Cart is empty</p>
                ) : (
                  <div className="space-y-4 max-h-80 overflow-y-auto">

                    {cartItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between items-center"
                      >

                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            ₹{item.product.price}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">

                          <button
                            onClick={() => removeItem(item.productId)}
                            className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>

                          <span className="text-sm font-medium text-gray-900">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => addItem(item.productId)}
                            className="px-2 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>

                        </div>

                      </div>
                    ))}

                  </div>
                )}

                {/*  FIXED FLOW */}
                <Link href="/cart">
                  <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                    View Cart
                  </button>
                </Link>

              </div>
            )}
          </div>
        )}

        {/* USER */}
        <div className="relative" ref={dropdownRef}>
          {!isLoggedIn ? (
            <Link href="/auth">
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg">
                Login / Register
              </button>
            </Link>
          ) : (
            <div>
              <button
                onClick={() => setOpen(!open)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg"
              >
                {userName || "User"} ▼
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">

                  <Link href="/profile">
                    <div className="px-4 py-2 hover:bg-gray-100 text-gray-900">
                      Profile
                    </div>
                  </Link>

                  <Link href="/address">
                    <div className="px-4 py-2 hover:bg-gray-100 text-gray-900">
                      Addresses
                    </div>
                  </Link>

                  <Link href="/orders">
                    <div className="px-4 py-2 hover:bg-gray-100 text-gray-900">
                      Orders
                    </div>
                  </Link>

                  <div
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </div>

                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
