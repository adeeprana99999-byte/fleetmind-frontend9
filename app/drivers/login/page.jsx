"use client";

import { useState } from "react";
import { postData } from "../../../lib/api";

export default function DriverLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await postData("drivers/login", { phone, password });

    if (res?.token) {
      localStorage.setItem("driverToken", res.token);
      window.location.href = "/drivers/home";
    } else {
      alert("Invalid phone or password");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Driver Login</h2>

      <input
        className="w-full border p-2 mb-3"
        placeholder="Phone Number"
        onChange={(e) => setPhone(e.target.value)}
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
