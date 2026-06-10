"use client";

import { useEffect, useState } from "react";
import { getData, postData, putData } from "../../lib/api";


export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [showAdd, setShowAdd] = useState(false);

  const [vehicleId, setVehicleId] = useState("");
  const [driverId, setDriverId] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleTotal, setVehicleTotal] = useState(0);

  const categories = [
    "Fuel",
    "Maintenance",
    "Mechanic Fee",
    "Parts",
    "Tires",
    "Oil Change",
    "Battery Replacement",
    "Inspection",
    "Registration Renewal",
    "License Plate Renewal",
    "Insurance",
    "Car Wash",
    "Toll",
    "Parking",
    "Driver Allowance",
    "Miscellaneous"
  ];

  useEffect(() => {
    Promise.all([
      getData("expenses"),
      getData("vehicles"),
      getData("drivers")
    ]).then(([exp, veh, drv]) => {
      setExpenses(Array.isArray(exp) ? exp : []);
      setVehicles(Array.isArray(veh) ? veh : []);
      setDrivers(Array.isArray(drv) ? drv : []);
    });
  }, []);

  // ⭐ UPDATE STATUS (Approve / Reject)
  // ⭐ UPDATE STATUS (Approve / Reject)
const updateStatus = async (id, status) => {
  try {
    const updated = await putData(`expenses/${id}/status`, { status });

    setExpenses((prev) =>
      prev.map((exp) =>
        exp._id === id ? { ...exp, status: updated.status } : exp
      )
    );
  } catch (err) {
    console.error("Status update failed:", err);
  }
};



  const saveExpense = async () => {
    if (!vehicleId) {
      alert("Please select a vehicle");
      return;
    }

    await postData("expenses", {
      vehicleId,
      driverId: driverId || null,
      amount,
      category,
      date
    });

    setShowAdd(false);
    window.location.reload();
  };

  const showVehicleExpenses = (vehicle) => {
    if (!vehicle) return;

    setSelectedVehicle(vehicle);

    const total = expenses
      .filter((e) => e.vehicleId?._id === vehicle._id)
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    setVehicleTotal(total);
    setShowVehicleModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Expenses</h1>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow"
        >
          + Add Expense
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
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Receipt</th>
          </tr>
        </thead>

        <tbody>
          {expenses.map((e) => (
            <tr key={e._id} className="border-b hover:bg-gray-50">
              {/* VEHICLE */}
              <td className="p-3">
                <span
                  className="text-blue-600 underline cursor-pointer"
                  onClick={() => showVehicleExpenses(e.vehicleId)}
                >
                  {e.vehicleId?.vehicleNumber || "—"}
                </span>
              </td>

              {/* DRIVER */}
              <td className="p-3">
                {e.driverId?.userId?.name || "—"}
              </td>

              {/* AMOUNT */}
              <td className="p-3 font-semibold text-red-600">
                ${Number(e.amount || 0).toFixed(2)}
              </td>

              {/* CATEGORY */}
              <td className="p-3">{e.category || "—"}</td>

              {/* DATE */}
              <td className="p-3">
                {e.date ? new Date(e.date).toLocaleDateString() : "—"}
              </td>

              {/* STATUS + APPROVE/REJECT */}
              <td className="p-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded text-white ${
                      e.status === "Pending"
                        ? "bg-yellow-500"
                        : e.status === "Approved"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {e.status}
                  </span>

                  {e.status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(e._id, "Approved")}
                        className="px-2 py-1 bg-green-600 text-white rounded text-sm"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => updateStatus(e._id, "Rejected")}
                        className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </td>

              {/* RECEIPT */}
              <td className="p-3">
                {e.receiptImageURL ? (
                  <a
                    href={e.receiptImageURL}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD EXPENSE MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">Add Expense</h2>

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

            <input
              className="w-full border p-2 mb-3"
              placeholder="Amount"
              type="number"
              onChange={(e) => setAmount(e.target.value)}
            />

            <select
              className="w-full border p-2 mb-3"
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="w-full border p-2 mb-3"
              onChange={(e) => setDate(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveExpense}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VEHICLE TOTAL EXPENSE MODAL */}
      {showVehicleModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">
              Expenses for {selectedVehicle.vehicleNumber}
            </h2>

            <p className="text-lg mb-4">
              <span className="font-semibold">Total:</span>{" "}
              <span className="text-red-600 font-bold">
                ${vehicleTotal.toFixed(2)}
              </span>
            </p>

            <button
              onClick={() => setShowVehicleModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
