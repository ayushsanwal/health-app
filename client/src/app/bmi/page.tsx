"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function BMIPage() {
const [height, setHeight] = useState("");
const [weight, setWeight] = useState("");
const [age, setAge] = useState("");
const [bmi, setBmi] = useState<number | null>(null);
const [category, setCategory] = useState("");

const calculateBMI = () => {
if (!height || !weight) return;


const h = parseFloat(height) / 100;
const w = parseFloat(weight);

const bmiValue = w / (h * h);
const rounded = parseFloat(bmiValue.toFixed(2));

setBmi(rounded);

if (rounded < 18.5) setCategory("Underweight");
else if (rounded < 24.9) setCategory("Normal");
else if (rounded < 29.9) setCategory("Overweight");
else setCategory("Obese");


};

const getColor = () => {
if (category === "Underweight") return "text-blue-600";
if (category === "Normal") return "text-green-600";
if (category === "Overweight") return "text-yellow-600";
if (category === "Obese") return "text-red-600";
return "";
};

return (
<div
className="min-h-screen bg-cover bg-center relative pt-20"
style={{
backgroundImage:
"url('https://images.unsplash.com/photo-1599058917765-a780eda07a3e?q=80&w=1974&auto=format&fit=crop')",
}}
>
{/* Dark overlay */} <div className="absolute inset-0 bg-black/40"></div>


  <Navbar />

  <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 py-12">

    {/* 🔥 LEFT SIDE (CENTERED CHART) */}
    <div className="flex items-center justify-center">

      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
          BMI Categories
        </h2>

        <div className="space-y-3">

          <div className="flex justify-between p-3 bg-blue-100 rounded-lg">
            <span className="font-medium text-blue-700">Underweight</span>
            <span className="text-gray-700">&lt; 18.5</span>
          </div>

          <div className="flex justify-between p-3 bg-green-100 rounded-lg">
            <span className="font-medium text-green-700">Normal</span>
            <span className="text-gray-700">18.5 - 24.9</span>
          </div>

          <div className="flex justify-between p-3 bg-yellow-100 rounded-lg">
            <span className="font-medium text-yellow-700">Overweight</span>
            <span className="text-gray-700">25 - 29.9</span>
          </div>

          <div className="flex justify-between p-3 bg-red-100 rounded-lg">
            <span className="font-medium text-red-700">Obese</span>
            <span className="text-gray-700">30+</span>
          </div>

        </div>
      </div>

    </div>

    {/* 🔥 RIGHT SIDE (GLASS CARD) */}
    <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl">

      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        BMI Calculator
      </h1>

      <input
        type="number"
        placeholder="Height (cm)"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg mb-4 text-gray-800 placeholder-gray-500"
      />

      <input
        type="number"
        placeholder="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg mb-4 text-gray-800 placeholder-gray-500"
      />

      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg mb-6 text-gray-800 placeholder-gray-500"
      />

      <button
        onClick={calculateBMI}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
      >
        Calculate BMI
      </button>

      {bmi && (
        <div className="mt-6 text-center">

          <p className="text-4xl font-bold text-gray-800">{bmi}</p>

          <p className={`text-lg font-semibold mb-4 ${getColor()}`}>
            {category}
          </p>

          <div className="bg-green-50 p-4 rounded-xl">
            <p className="text-gray-700 mb-2">
              Improve your health with a personalized meal plan
            </p>

            <Link href="/meal">
              <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
                Get Meal Plan
              </button>
            </Link>
          </div>

        </div>
      )}

    </div>

  </div>
</div>


);
}
