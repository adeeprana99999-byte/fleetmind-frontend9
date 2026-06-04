"use client";

import { useState } from "react";
import { postData } from "../../lib/api";

export default function AddVehicleModal({ close }) {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const save = async () => {
    await postData("vehicles", { vehicleNumber, make, model });
    close();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Add Vehicle</h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Vehicle Number"
          onChange={(e) => setVehicleNumber(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          placeholder="Make"
          onChange={(e) => setMake(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          placeholder="Model"
          onChange={(e) => setModel(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={close} className="px-4 py-2 border rounded">
            Cancel
          </button>

          <button
            onClick={save}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
