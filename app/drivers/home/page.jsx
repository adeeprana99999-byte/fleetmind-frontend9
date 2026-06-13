"use client";

import { useEffect, useState } from "react";
import { getData } from "../../../lib/api";

export default function DriverHome() {
  const [user, setUser] = useState(null);
useEffect(() => {
  const token = localStorage.getItem("driverToken");
  getData("auth/me", token).then((res) => setUser(res.user));
}, []);


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>

      <div className="bg-white p-4 rounded shadow mb-4">
        <h3 className="font-semibold mb-2">Assigned Vehicle</h3>
        <p>
          {user?.assignedVehicle
            ? user.assignedVehicle.vehicleNumber
            : "No vehicle assigned"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <a
          href="/drivers/upload"
          className="bg-blue-600 text-white p-4 rounded text-center"
        >
          Upload Receipt
        </a>

        <a
          href="/drivers/receipts"
          className="bg-gray-700 text-white p-4 rounded text-center"
        >
          My Receipts
        </a>

        <a
          href="/drivers/expenses"
          className="bg-red-600 text-white p-4 rounded text-center"
        >
          My Expenses
        </a>
      </div>
    </div>
  );
}
