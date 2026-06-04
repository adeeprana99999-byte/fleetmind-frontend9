"use client";

import { useEffect, useState } from "react";
import { getData } from "../../lib/api";

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [showAdd, setShowAdd] = useState(false);

  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    Promise.all([getData("receipts"), getData("vehicles"), getData("drivers")])
      .then(([rec, veh, drv]) => {
        setReceipts(rec);
        setVehicles(veh);
        setDrivers(drv);
      });
  }, []);

  const statusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500";
      case "Processing":
        return "bg-blue-500";
      case "Completed":
        return "bg-green-600";
      case "Failed":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  // ============================
  // APPROVE / REJECT RECEIPT
  // ============================
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/receipts/status/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    window.location.reload();
  };

  // ============================
  // UPLOAD RECEIPT
  // ============================
  const uploadReceipt = async () => {
    if (!vehicleId || !driverId || !file) {
      alert("Vehicle, driver, and receipt image are required");
      return;
    }

    const token = localStorage.getItem("token");

    const form = new FormData();
    form.append("receipt", file);
    form.append("vehicleId", vehicleId);
    form.append("driverId", driverId);

    await fetch("http://localhost:5000/api/receipts/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });

    setShowAdd(false);
    window.location.reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Receipts</h1>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          + Upload Receipt
        </button>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-3 text-left">Driver</th>
            <th className="p-3 text-left">Vehicle</th>
            <th className="p-3 text-left">Receipt</th>
            <th className="p-3 text-left">AI Status</th>
            <th className="p-3 text-left">Extracted Amount</th>
            <th className="p-3 text-left">Expense Link</th>
            <th className="p-3 text-left">Uploaded</th>
            <th className="p-3 text-left">Admin Action</th>
          </tr>
        </thead>

        <tbody>
          {receipts.map((r) => (
            <tr key={r._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{r.driverId?.userId?.name || "—"}</td>

              <td className="p-3">{r.vehicleId?.vehicleNumber || "—"}</td>

              <td className="p-3">
                <a
                  href={r.imageURL}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  View
                </a>
              </td>

              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded text-white ${statusColor(
                    r.aiStatus
                  )}`}
                >
                  {r.aiStatus}
                </span>
              </td>

              <td className="p-3">
                {r.aiResult?.amount
                  ? `$${r.aiResult.amount.toFixed(2)}`
                  : "—"}
              </td>

              <td className="p-3">
                {r.aiResult?.expenseId ? (
                  <a
                    href={`/expenses?highlight=${r.aiResult.expenseId}`}
                    className="text-blue-600 underline"
                  >
                    View Expense
                  </a>
                ) : (
                  "—"
                )}
              </td>

              <td className="p-3">
                {new Date(r.createdAt).toLocaleDateString()}
              </td>

              {/* ADMIN ACTION BUTTONS */}
              <td className="p-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(r._id, "Approved")}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(r._id, "Rejected")}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* UPLOAD RECEIPT MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">Upload Receipt</h2>

            {/* VEHICLE */}
            <select
              className="w-full border p-2 mb-3"
              onChange={(e) => setVehicleId(e.target.value)}
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.vehicleNumber} — {v.make} {v.model}
                </option>
              ))}
            </select>

            {/* DRIVER */}
            <select
              className="w-full border p-2 mb-3"
              onChange={(e) => setDriverId(e.target.value)}
            >
              <option value="">Select Driver</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.userId?.name}
                </option>
              ))}
            </select>

            {/* FILE UPLOAD */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="w-full border p-2 mb-3"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={uploadReceipt}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
