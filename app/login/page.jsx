"use client";

import { useState } from "react";
import { postData } from "../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await postData("admin/login", { email, password });
    if (res && !res.error) {
      window.location.href = "/dashboard/vehicles";
    } else {
      alert("Invalid login");
    }
  };

  return (
    <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">FleetMind</h1>
        <p className="text-gray-500 mt-1">Welcome Back</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={login}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Login
        </button>
      </div>

      <p className="text-center text-gray-400 text-sm mt-6">
        © 2026 FleetMind — All Rights Reserved
      </p>
    </div>
  );
}
