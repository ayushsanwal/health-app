"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export default function AddressPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  // 🔥 FETCH ADDRESSES
  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/address",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAddresses(res.data.addresses);
    } catch (error) {
      console.error("Error fetching addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // 🔥 HANDLE INPUT
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 ADD ADDRESS
  const addAddress = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/address/add",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Address added ✅");

      // reset form
      setForm({
        fullName: "",
        phone: "",
        line1: "",
        line2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
      });

      fetchAddresses();
    } catch (error) {
      alert("Error adding address");
    }
  };

  // 🔥 DELETE ADDRESS (FIXED ROUTE)
  const deleteAddress = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5000/api/address/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Address removed ❌");

      fetchAddresses();
    } catch (error) {
      alert("Error deleting address");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-green-50 to-gray-200 pt-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Your Addresses
        </h1>

        {/* 🔥 ADD ADDRESS FORM */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-10">

          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Add New Address
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black"
            />

            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black"
            />

            <input
              name="line1"
              placeholder="Address Line 1"
              value={form.line1}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black col-span-2"
            />

            <input
              name="line2"
              placeholder="Address Line 2"
              value={form.line2}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black col-span-2"
            />

            <input
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black"
            />

            <input
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black"
            />

            <input
              name="postalCode"
              placeholder="Postal Code"
              value={form.postalCode}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black"
            />

            <input
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
              className="p-3 border rounded-lg text-black"
            />

          </div>

          <button
            onClick={addAddress}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Add Address
          </button>
        </div>

        {/* 🔥 ADDRESS LIST */}
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : addresses.length === 0 ? (
          <p className="text-gray-600">No addresses added yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-gray-800">
                  {addr.fullName}
                </h3>

                <p className="text-sm text-gray-600">{addr.phone}</p>

                <p className="mt-2 text-gray-700">
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ""}
                </p>

                <p className="text-gray-700">
                  {addr.city}, {addr.state}
                </p>

                <p className="text-gray-700">
                  {addr.postalCode}, {addr.country}
                </p>

                <button
                  onClick={() => deleteAddress(addr.id)}
                  className="mt-4 text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}