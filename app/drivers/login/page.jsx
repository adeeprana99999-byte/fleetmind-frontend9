"use client";

import { useState } from "react";
import { login } from "../../../lib/api";

export default function DriverLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await login(email, password);

    if (res?.token && res.user.role === "driver") {
      localStorage.setItem("token", res.token);
      window.location.href = "/driver/home";
    } else {
      alert("Invalid driver credentials");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Driver Login</h2>

      <input
        className="w-full border p-2 mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-3"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
