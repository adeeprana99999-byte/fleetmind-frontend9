"use client";

import { useState, useEffect } from "react";

export default function UploadReceipt() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);

  // Load logged-in driver
  useEffect(() => {
    const token = localStorage.getItem("driverToken");

    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setUser(data.user));
  }, []);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a receipt image");
      return;
    }

    const token = localStorage.getItem("driverToken");

    const formData = new FormData();
    formData.append("receipt", file); // MUST match multer field name

    const res = await fetch("http://localhost:5000/api/receipts/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upload Receipt</h2>

      <input
        type="file"
        accept="image/*"
        capture="environment"   // allows camera on mobile
        className="w-full border p-2 mb-3"
        onChange={(e) => setFile(e.target.files[0])}
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
