"use client";

import { useState } from "react";
import { postData } from "../../lib/api";

export default function AssignDriverModal({ close, vehicle, drivers }) {
  const [driverId, setDriverId] = useState("");

  const save = async () => {
    await postData(`vehicles/${vehicle._id}/assign`, { driverId });
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
            <option key={d._id} value={d._id}>
              {d.name}
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
