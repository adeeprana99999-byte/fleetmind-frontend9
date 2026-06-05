"use client";

import { useState } from "react";
import { login } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await login({ email, password });

    if (res?.token) {
      localStorage.setItem("token", res.token);
      router.push("/vehicles");
    } else {
      setError("Invalid login");
    }
  }

  return (
    <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <img
          src="/logo.png"
          alt="FleetMind Logo"
          className="w-24 h-24 object-contain"
        />
      </div>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Welcome Back
      </h1>

      {error && (
        <p className="text-red-500 text-center mb-4 font-medium">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="border border-gray-300 p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition"
        >
          Login
        </button>
      </form>

      <p className="text-center text-gray-500 text-sm mt-6">
        © {new Date().getFullYear()} FleetMind — All Rights Reserved
      </p>
    </div>
  );
}
