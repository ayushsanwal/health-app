"use client";

import { useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

type Meal = {
  meal: string;
  calories: number;
};

type DayPlan = {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal;
  totalCalories: number;
};

type WeeklyPlan = {
  [key: string]: DayPlan;
};

type MealKey = "breakfast" | "lunch" | "dinner" | "snacks";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function MealPage() {
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [selectedDay, setSelectedDay] = useState("monday");
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    try {
      const token = localStorage.getItem("token");

      // 🔥 HANDLE NOT LOGGED IN BEFORE API CALL
      if (!token) {
        alert("Please login or register to generate your personalized meal plan");
        return;
      }

      setLoading(true);

      const res = await axios.post(
        "http://localhost:5000/api/meal/generate",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPlan(res.data.mealPlan);

    } catch (err: any) {
      console.error(err);

      
      if (err.response?.status === 401) {
        alert("Please login to generate your meal plan");
      } else {
        alert("Failed to generate meal plan");
      }

    } finally {
      setLoading(false);
    }
  };

  const dayData = plan?.[selectedDay];

  return (
    <div className="relative min-h-screen pt-20">

      {/* 🔥 BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1498837167922-ddd27525d352')",
        }}
      />

      {/*  OVERLAY GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-green-50 to-gray-200" />

      {/*  CONTENT */}
      <div className="relative z-10">
        <Navbar />

        <div className="max-w-5xl mx-auto px-6 py-10">

          <h1 className="text-3xl font-bold mb-6 text-gray-900">
            AI Weekly Meal Plan
          </h1>

          {/* GENERATE BUTTON */}
          {!plan && (
            <button
              onClick={generatePlan}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              {loading ? "Generating..." : "Generate Meal Plan"}
            </button>
          )}

          {/* DAY SELECTOR */}
          {plan && (
            <>
              <div className="flex flex-wrap gap-3 mb-8">

                {days.map((day) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-lg capitalize font-medium ${
                      selectedDay === day
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-800 shadow"
                    }`}
                  >
                    {day}
                  </button>
                ))}

              </div>

              {/* MEAL DISPLAY */}
              {dayData && (
                <div className="grid md:grid-cols-2 gap-6">

                  {(["breakfast", "lunch", "dinner", "snacks"] as MealKey[]).map(
                    (mealType) => (
                      <div
                        key={mealType}
                        className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow"
                      >
                        <h2 className="font-semibold text-lg text-gray-900 capitalize">
                          {mealType}
                        </h2>

                        <p className="mt-2 text-gray-800">
                          {dayData[mealType].meal}
                        </p>

                        <p className="mt-2 text-sm text-green-600 font-semibold">
                          {dayData[mealType].calories} kcal
                        </p>
                      </div>
                    )
                  )}

                  {/* TOTAL */}
                  <div className="bg-green-100/90 backdrop-blur-md p-6 rounded-xl col-span-2 text-center">

                    <h2 className="text-xl font-semibold text-green-900">
                      Total Calories
                    </h2>

                    <p className="text-2xl font-bold text-green-800 mt-2">
                      {dayData.totalCalories} kcal
                    </p>

                  </div>

                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}