"use client";

import { useState } from "react";

export default function UploadReceipt() {
  const [imageURL, setImageURL] = useState("");
  const [vehicleId, setVehicleId] = useState("");

  const handleUpload = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/receipts/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ imageURL, vehicleId }),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upload Receipt</h2>

      <input
        className="w-full border p-2 mb-3"
        placeholder="Image URL"
        onChange={(e) => setImageURL(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-3"
        placeholder="Vehicle ID"
        onChange={(e) => setVehicleId(e.target.value)}
      />

      <button
        onClick={handleUpload}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        Upload
      </button>
    </div>
  );
}
