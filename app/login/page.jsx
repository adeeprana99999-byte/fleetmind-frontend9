"use client";

import { useEffect, useState } from "react";
import { getData } from "../../lib/api";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData("vehicles")
      .then((res) => {
        setVehicles(res.vehicles || res || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-white shadow rounded">
        Loading vehicles...
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Vehicles</h1>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="border-b bg-gray-100 text-gray-700">
              <th className="p-3 text-left font-semibold">Vehicle #</th>
              <th className="p-3 text-left font-semibold">Make</th>
              <th className="p-3 text-left font-semibold">Model</th>
              <th className="p-3 text-left font-semibold">Driver</th>
            </tr>
          </thead>

          <tbody>
            {vehicles.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No vehicles found.
                </td>
              </tr>
            )}

            {vehicles.map((v) => (
              <tr
                key={v._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{v.vehicleNumber}</td>
                <td className="p-3">{v.make}</td>
                <td className="p-3">{v.model}</td>
                <td className="p-3">
                  {v.assignedDriver?.userId?.name || "Unassigned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
