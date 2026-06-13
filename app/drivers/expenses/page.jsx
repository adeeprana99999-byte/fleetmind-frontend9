"use client";

import { useEffect, useState } from "react";
import { getData, postData } from "../../../lib/api";

export default function DriverExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [user, setUser] = useState(null);

  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const categories = [
    "Fuel", "Maintenance", "Mechanic Fee", "Parts", "Tires",
    "Oil Change", "Battery Replacement", "Inspection",
    "Registration Renewal", "License Plate Renewal",
    "Insurance", "Car Wash", "Toll", "Parking",
    "Driver Allowance", "Miscellaneous"
  ];

  // Load logged-in driver
  useEffect(() => {
    getData("auth/me").then((res) => {
      if (res?.user) setUser(res.user);
    });
  }, []);

  // Load expenses AFTER user loads
  useEffect(() => {
    if (!user) return;

    getData("expenses/driver").then((res) => {
      setExpenses(res || []);
    });
  }, [user]);

  // Save new expense
  const saveExpense = async () => {
    if (!amount || !category || !date) {
      alert("Please fill all fields");
      return;
    }

    await postData("expenses", {
      amount,
      category,
      date
    });

    setShowAdd(false);
    window.location.reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">My Expenses</h2>

        <button
          disabled={!user}
          onClick={() => setShowAdd(true)}
          className={`px-4 py-2 rounded shadow 
            ${user ? "bg-blue-600 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
        >
          + Add Expense
        </button>
      </div>

      {/* EXPENSE LIST */}
      {expenses.map((e) => (
        <div key={e._id} className="bg-white p-4 rounded shadow mb-3">
          <p className="font-semibold">${Number(e.amount).toFixed(2)}</p>
          <p>{e.category}</p>
          <p>{new Date(e.date).toLocaleDateString()}</p>
          <p>
            Status:{" "}
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
          </p>
        </div>
      ))}

      {/* ADD EXPENSE MODAL */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">Add Expense</h2>

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
                <option key={c} value={c}>{c}</option>
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
    </div>
  );
}
