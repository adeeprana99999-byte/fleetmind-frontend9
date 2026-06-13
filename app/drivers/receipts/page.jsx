"use client";

import { useEffect, useState } from "react";
import { getData } from "../../../lib/api";

export default function DriverReceipts() {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    getData("receipts/my").then((res) => {
      if (Array.isArray(res)) {
        setReceipts(res);
      }
    });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Receipts</h2>

      {receipts.length === 0 && (
        <p className="text-gray-600">No receipts uploaded yet.</p>
      )}

      {receipts.map((r) => (
        <div key={r._id} className="bg-white p-4 rounded shadow mb-3">
          <p className="font-semibold">Status: {r.adminStatus}</p>

          <a
            href={r.imageURL}
            target="_blank"
            className="text-blue-600 underline"
          >
            View Receipt
          </a>
        </div>
      ))}
    </div>
  );
}
