"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import SocialSidebar from "@/components/SocialSidebar";
import Link from "next/link";

type Product = {
id: string;
name: string;
price: number;
imageUrl?: string;
rating: number;
};

export default function Home() {
const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
const fetchTopProducts = async () => {
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

      setProducts(res.data.recommendations.slice(0, 5));
    } else {
      const res = await axios.get("http://localhost:5000/api/products");

      const sorted = res.data.products
        .sort((a: Product, b: Product) => b.rating - a.rating)
        .slice(0, 5);

      setProducts(sorted);
    }

  } catch (err) {
    console.error(err);
  }
};

fetchTopProducts();


}, []);

return ( <main className="min-h-screen pt-20">


  <Navbar />
  <SocialSidebar />

  {/* HERO */}
  <section
    className="h-screen flex flex-col justify-center items-center text-center text-white px-6"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1554284126-aa88f22d8b74')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="bg-black/60 backdrop-blur-md p-10 rounded-2xl shadow-xl max-w-2xl">
      <h1 className="text-5xl font-bold mb-6">
        Transform Your Health Journey
      </h1>

      <p className="text-lg mb-6 text-gray-200">
        “Take care of your body. It’s the only place you have to live.”
      </p>

      <div className="flex gap-4 justify-center flex-wrap">
        <Link href="/bmi">
          <button className="bg-green-600 px-6 py-3 rounded-xl">
            Calculate BMI
          </button>
        </Link>

        <Link href="/meal">
          <button className="bg-white text-black px-6 py-3 rounded-xl">
            Meal Plan
          </button>
        </Link>

        <Link href="/marketplace">
          <button className="border px-6 py-3 rounded-xl">
            Shop Products
          </button>
        </Link>
      </div>
    </div>
  </section>

  {/* 🔥 RECOMMENDED SECTION */}
  <section className="max-w-6xl mx-auto px-6 py-16">

    <h2 className="text-3xl font-bold mb-10 text-white text-center drop-shadow-lg">
      Products Recommended for You
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">

      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-xl shadow p-3"
        >
          <div className="h-28 bg-gray-100 rounded mb-2 overflow-hidden">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <p className="text-sm font-semibold">{product.name}</p>
          <p className="text-green-600 text-sm">₹{product.price}</p>

        </div>
      ))}

    </div>

  </section>

  {/* FOOTER (unchanged) */}
  <footer className="bg-gray-900 text-gray-300 py-16 px-6">
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">

      <div>
        <h3 className="text-xl font-semibold text-white mb-4">HealthApp</h3>
        <p className="text-sm">
          Your all-in-one platform for fitness and nutrition.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
        <p>Email: support@healthapp.com</p>
        <p>Phone: +91 9999999999</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
        <p>Noida, India</p>
      </div>

    </div>
  </footer>

</main>


);
}
