"use client";

import { useEffect, useState } from "react";
import { getData } from "../../../lib/api";

export default function DriverExpenses() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    getData("expenses").then((all) => {
      const mine = all.filter((e) => e.driverId?._id);
      setExpenses(mine);
    });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Expenses</h2>

      {expenses.map((e) => (
        <div key={e._id} className="bg-white p-4 rounded shadow mb-3">
          <p className="font-semibold">${e.amount.toFixed(2)}</p>
          <p>{e.category}</p>
          <p>{new Date(e.date).toLocaleDateString()}</p>
          <p>Status: {e.status}</p>
        </div>
      ))}
    </div>
  );
}
