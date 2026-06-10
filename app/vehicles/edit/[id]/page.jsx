"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getData, putData } from "../../../../lib/api";

export default function EditVehiclePage() {
  const { id } = useParams();

  const [vehicle, setVehicle] = useState(null);

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");

  useEffect(() => {
    if (!id) return;

    getData(`vehicles/${id}`).then((data) => {
      setVehicle(data);

      setVehicleNumber(data.vehicleNumber || "");
      setMake(data.make || "");
      setModel(data.model || "");
      setYear(data.year || "");
      setMileage(data.mileage || 0);
    });
  }, [id]);

  const saveVehicle = async () => {
    await putData(`vehicles/${id}`, {
      vehicleNumber,
      make,
      model,
      year,
      mileage,
    });

    alert("Vehicle updated");
    window.location.href = "/vehicles";
  };

  if (!vehicle) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => (window.location.href = "/vehicles")}
        className="mb-4 px-4 py-2 bg-gray-200 rounded"
      >
        ← Back to Vehicles
      </button>

      <h1 className="text-2xl font-bold mb-4">Edit Vehicle</h1>

      <div className="space-y-4">

        <input
          className="w-full border p-2 rounded"
          placeholder="Vehicle Number"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Mileage"
          type="number"
          value={mileage}
          onChange={(e) => setMileage(e.target.value)}
        />

        <button
          onClick={saveVehicle}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
