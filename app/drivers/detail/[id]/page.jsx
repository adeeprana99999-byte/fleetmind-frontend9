"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getData } from "../../../../lib/api";

export default function DriverDetailsPage() {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    if (!id) return;

    getData(`drivers/${id}`).then((res) => {
      setDriver(res);
    });
  }, [id]);

  if (!driver) return <div className="p-6">Loading...</div>;

  const u = driver.userId || {};

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow rounded">
      <button
        onClick={() => (window.location.href = "/drivers")}
        className="mb-4 px-4 py-2 bg-gray-200 rounded"
      >
        ← Back to Drivers
      </button>

      <h1 className="text-2xl font-bold mb-4">Driver Details</h1>

      <div className="space-y-3">
        <p><strong>Name:</strong> {u.name}</p>
        <p><strong>Phone:</strong> {u.phone}</p>
        <p><strong>License Number:</strong> {driver.licenseNumber}</p>
        <p><strong>License Expiry:</strong> {driver.licenseExpiry ? new Date(driver.licenseExpiry).toLocaleDateString() : "—"}</p>

        <p><strong>Assigned Vehicle:</strong> 
          {u.assignedVehicle ? u.assignedVehicle.vehicleNumber : "Unassigned"}
        </p>
      </div>

      {/* License Photo */}
      {driver.licensePhoto && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">License Photo</h2>
          <img
            src={driver.licensePhoto}
            className="w-48 rounded border"
            alt="Driver License"
          />
        </div>
      )}

      {/* Documents */}
      {driver.documents?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Documents</h2>
          {driver.documents.map((doc, i) => (
            <a
              key={i}
              href={doc}
              target="_blank"
              className="text-blue-600 underline block mt-1"
            >
              View Document {i + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

