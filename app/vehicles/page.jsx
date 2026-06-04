"use client";

import { useEffect, useState } from "react";
import { getData, postData, putData } from "../../lib/api";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [showAdd, setShowAdd] = useState(false);
  const [showAssign, setShowAssign] = useState(false);

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState("");

  useEffect(() => {
    Promise.all([getData("vehicles"), getData("drivers")]).then(([v, d]) => {
      setVehicles(Array.isArray(v) ? v : []);
      setDrivers(Array.isArray(d) ? d : []);
    });
  }, []);

  const saveVehicle = async () => {
    await postData("vehicles", {
      vehicleNumber,
      make,
      model,
    });

    setShowAdd(false);
    window.location.reload();
  };

  const assignDriver = async () => {
    if (!selectedDriver) {
      alert("Please select a driver");
      return;
    }

    await putData(`vehicles/${selectedVehicle._id}/assign-driver`, {
      driverId: selectedDriver,
    });

    setShowAssign(false);
    window.location.reload();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Vehicles</h1>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          + Add Vehicle
        </button>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-3 text-left">Vehicle #</th>
            <th className="p-3 text-left">Make</th>
            <th className="p-3 text-left">Model</th>
            <th className="p-3 text-left">Driver</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.map((v) => (
            <tr
              key={v._id}
              className="border-b hover:bg-gray-50 transition"
              style={{ cursor: "default" }}
            >
              <td className="p-3"><span
  className="text-blue-600 underline cursor-pointer"
  onClick={() => (window.location.href = `/vehicles/details?id=${v._id}`)}
>
  {v.vehicleNumber}
</span></td>
              <td className="p-3">{v.make}</td>
              <td className="p-3">{v.model}</td>
              <td className="p-3">
                {v.assignedDriver?.userId?.name || "Unassigned"}
              </td>

              <td className="p-3" style={{ pointerEvents: "auto" }}>
                <button
                  onClick={() => {
                    setSelectedVehicle(v);
                    setShowAssign(true);
                  }}
                  className="text-blue-600 underline cursor-pointer"
                >
                  Assign Driver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAdd && (
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
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveVehicle}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssign && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">
              Assign Driver to {selectedVehicle.vehicleNumber}
            </h2>

            <select
              className="w-full border p-2 mb-3"
              onChange={(e) => setSelectedDriver(e.target.value)}
            >
              <option value="">Select Driver</option>
              {drivers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.userId?.name}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAssign(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={assignDriver}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
