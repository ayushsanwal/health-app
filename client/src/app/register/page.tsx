"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
const router = useRouter();

const [form, setForm] = useState({
name: "",
email: "",
password: "",
age: "",
height: "",
weight: "",
goal: "",
dietPreference: "",
activityLevel: "",
});

const [loading, setLoading] = useState(false);

const handleChange = (e: any) => {
setForm({ ...form, [e.target.name]: e.target.value });
};

const handleRegister = async () => {
try {
setLoading(true);


  // 1️⃣ Register user
  await axios.post("http://localhost:5000/api/auth/register", {
    name: form.name,
    email: form.email,
    password: form.password,
  });

  // 2️⃣ Login → get token
  const loginRes = await axios.post(
    "http://localhost:5000/api/auth/login",
    {
      email: form.email,
      password: form.password,
    }
  );

  const token = loginRes.data.token;
  localStorage.setItem("token", token);

  // 3️⃣ Save health profile
  await axios.post(
    "http://localhost:5000/api/health/profile",
    {
      age: Number(form.age),
      height: Number(form.height),
      weight: Number(form.weight),
      goal: form.goal,
      dietPreference: form.dietPreference,
      activityLevel: form.activityLevel,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  alert("Registration successful 🎉");

  router.push("/");

} catch (error: any) {
  alert(error.response?.data?.error || "Error occurred");
} finally {
  setLoading(false);
}


};

return ( <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-gray-100 p-6">


  <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">

    <h2 className="text-2xl font-bold mb-6 text-center">
      Create Account
    </h2>

    <div className="space-y-4">

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      />

      <input
        name="age"
        placeholder="Age"
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      />

      <input
        name="height"
        placeholder="Height (cm)"
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      />

      <input
        name="weight"
        placeholder="Weight (kg)"
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      />

      <select
        name="goal"
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      >
        <option value="">Select Goal</option>
        <option value="weight_loss">Weight Loss</option>
        <option value="muscle_gain">Muscle Gain</option>
        <option value="maintain">Maintain</option>
      </select>

      <select
        name="dietPreference"
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      >
        <option value="">Diet Preference</option>
        <option value="veg">Vegetarian</option>
        <option value="non_veg">Non-Vegetarian</option>
        <option value="keto">Keto</option>
      </select>

      <select
        name="activityLevel"
        onChange={handleChange}
        className="w-full p-3 border rounded-lg"
      >
        <option value="">Activity Level</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button
        onClick={handleRegister}
        disabled={loading}
        className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
      >
        {loading ? "Creating..." : "Register"}
      </button>

    </div>

  </div>

</div>


);
}
