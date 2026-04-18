"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          { email, password }
        );

        localStorage.setItem("token", res.data.token);
        alert("Login successful 🚀");
        router.push("/");
      } else {
        await axios.post("http://localhost:5000/api/auth/register", {
          name,
          email,
          password,
        });

        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          { email, password }
        );

        localStorage.setItem("token", res.data.token);
        alert("Registered & Logged in 🚀");

        router.push("/profile");
      }
    } catch (error: any) {
      alert(error?.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* 🔥 BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438')",
        }}
      />

      {/* 🔥 DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60" />

      {/* 🔥 CONTENT */}
      <div className="relative flex items-center justify-center min-h-screen px-4">

        <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md">

          {/* 🔥 TOGGLE (FIXED VISIBILITY) */}
          <div className="flex mb-6 bg-gray-200 rounded-full p-1">

            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2 rounded-full font-semibold transition ${
                isLogin
                  ? "bg-green-600 text-white"
                  : "text-gray-700"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2 rounded-full font-semibold transition ${
                !isLogin
                  ? "bg-green-600 text-white"
                  : "text-gray-700"
              }`}
            >
              Register
            </button>

          </div>

          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>

          {/* FORM */}
          <div className="flex flex-col gap-4">

            {!isLogin && (
              <input
                type="text"
                placeholder="Name"
                className="p-3 border rounded-lg text-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              type="email"
              placeholder="Email"
              className="p-3 border rounded-lg text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="p-3 border rounded-lg text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              {isLogin ? "Login" : "Register"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}