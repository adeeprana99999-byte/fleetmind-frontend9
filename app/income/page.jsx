"use client";

import { useEffect, useState } from "react";
import { getData, postData } from "../../lib/api";

export default function IncomePage() {
  const [income, setIncome] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [showAdd, setShowAdd] = useState(false);

  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Trip");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const categories = ["Trip", "Delivery", "Customer Payment"];

  useEffect(() => {
    Promise.all([
      getData("income"),
      getData("vehicles"),
      getData("drivers"),
    ]).then(([inc, veh, drv]) => {
      setIncome(inc);
      setVehicles(veh);
      setDrivers(drv);
    });
  }, []);

  const saveIncome = async () => {
    if (!vehicleId || !amount || !date) {
      alert("Vehicle, amount and date are required");
      return;
    }

    await postData("income", {
      vehicleId,
      driverId: driverId || null,
      amount,
      category,
      date,
      notes,
    });

    setShowAdd(false);
    window.location.reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Income Records</h1>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          + Add Income
        </button>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="p-3 text-left">Vehicle</th>
            <th className="p-3 text-left">Driver</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Notes</th>
          </tr>
        </thead>

        <tbody>
          {income.map((i) => (
            <tr key={i._id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <span
                  className="text-blue-600 underline cursor-pointer"
                  onClick={() =>
                    (window.location.href = `/vehicles/details?id=${i.vehicleId?._id}`)
                  }
                >
                  {i.vehicleId?.vehicleNumber || "—"}
                </span>
              </td>

              <td className="p-3">
                {i.driverId?.userId?.name || "—"}
              </td>

              <td className="p-3 font-semibold text-green-600">
                ${Number(i.amount).toFixed(2)}
              </td>

              <td className="p-3">{i.category}</td>

              <td className="p-3">
                {new Date(i.date).toLocaleDateString()}
              </td>

              <td className="p-3">{i.notes || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD INCOME MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">Add Income</h2>

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
              <option value="">Select Driver (optional)</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.userId?.name}
                </option>
              ))}
            </select>

            {/* AMOUNT */}
            <input
              className="w-full border p-2 mb-3"
              placeholder="Amount"
              type="number"
              onChange={(e) => setAmount(e.target.value)}
            />

            {/* CATEGORY */}
            <select
              className="w-full border p-2 mb-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* DATE */}
            <input
              type="date"
              className="w-full border p-2 mb-3"
              onChange={(e) => setDate(e.target.value)}
            />

            {/* NOTES */}
            <textarea
              className="w-full border p-2 mb-3"
              placeholder="Notes (optional)"
              rows={3}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveIncome}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
