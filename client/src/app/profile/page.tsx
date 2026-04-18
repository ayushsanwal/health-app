"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    age: "",
    gender: "",
    height: "",
    weight: "",
    goal: "",
    dietPreference: "",
    activityLevel: "",
  });

  // 🔥 FETCH EXISTING PROFILE (for edit case)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://localhost:5000/api/health/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.profile) {
          setForm({
            age: res.data.profile.age || "",
            gender: res.data.profile.gender || "",
            height: res.data.profile.height || "",
            weight: res.data.profile.weight || "",
            goal: res.data.profile.goal || "",
            dietPreference: res.data.profile.dietPreference || "",
            activityLevel: res.data.profile.activityLevel || "",
          });
        }
      } catch (error) {
        console.log("No profile yet (new user)");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // 🔥 HANDLE INPUT
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 SAVE PROFILE
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/health/profile",
        {
          ...form,
          age: Number(form.age),
          height: Number(form.height),
          weight: Number(form.weight),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Profile saved successfully 🚀");

      router.push("/"); // go to home
    } catch (error: any) {
      alert("Error saving profile");
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  return (
    <div className="min-h-screen relative">
      <Navbar />

      {/* 🔥 BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1518611012118-696072aa579a')",
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* 🔥 FORM */}
      <div className="relative flex items-center justify-center min-h-screen px-4">

        <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-lg">

          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Your Health Profile
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <input
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black"
            />

            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input
              name="height"
              placeholder="Height (cm)"
              value={form.height}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black"
            />

            <input
              name="weight"
              placeholder="Weight (kg)"
              value={form.weight}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black"
            />

            <select
              name="goal"
              value={form.goal}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black col-span-2"
            >
              <option value="">Goal</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="maintain">Maintain</option>
            </select>

            <select
              name="dietPreference"
              value={form.dietPreference}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black col-span-2"
            >
              <option value="">Diet Preference</option>
              <option value="veg">Vegetarian</option>
              <option value="non_veg">Non-Veg</option>
              <option value="keto">Keto</option>
            </select>

            <select
              name="activityLevel"
              value={form.activityLevel}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black col-span-2"
            >
              <option value="">Activity Level</option>
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>

          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Save Profile
          </button>

        </div>
      </div>
    </div>
  );
}