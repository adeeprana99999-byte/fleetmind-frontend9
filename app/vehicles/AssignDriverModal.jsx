"use client";

import { useState } from "react";
import { putData } from "../../lib/api";

export default function AssignDriverModal({ close, vehicle, drivers }) {
  const [driverId, setDriverId] = useState("");

  const save = async () => {
    if (!driverId) {
      alert("Please select a driver");
      return;
    }

    await putData(`vehicles/${vehicle._id}/assign-driver`, { driverId });

    close();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">
          Assign Driver to {vehicle.vehicleNumber}
        </h2>

        <select
          className="w-full border p-2 mb-3"
          onChange={(e) => setDriverId(e.target.value)}
        >
          <option value="">Select Driver</option>
          {drivers.map((d) => (
            <option key={d._id} value={d.userId?._id}>
              {d.userId?.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={close} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={save}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
