"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getData, putData } from "../../../lib/api";

export default function EditDriverPage() {
  const params = useSearchParams();
  const id = params.get("id");

  const [driver, setDriver] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  useEffect(() => {
    if (!id) return;

    getData(`drivers/${id}`).then((data) => {
      setDriver(data);
      setName(data.userId?.name || "");
      setPhone(data.userId?.phone || "");
      setLicenseNumber(data.licenseNumber || "");
      setLicenseExpiry(data.licenseExpiry?.substring(0, 10) || "");
      setAddress(data.address || "");
      setEmergencyContact(data.emergencyContact || "");
    });
  }, [id]);

  const saveDriver = async () => {
    await putData(`drivers/${id}`, {
      licenseNumber,
      licenseExpiry,
      address,
      emergencyContact,
    });

    alert("Driver updated");
    window.location.href = "/drivers";
  };

  if (!driver) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Driver</h1>

      <div className="space-y-3 max-w-md">
        <input
          className="w-full border p-2"
          value={name}
          disabled
        />

        <input
          className="w-full border p-2"
          value={phone}
          disabled
        />

        <input
          className="w-full border p-2"
          placeholder="License Number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
        />

        <input
          type="date"
          className="w-full border p-2"
          value={licenseExpiry}
          onChange={(e) => setLicenseExpiry(e.target.value)}
        />

        <input
          className="w-full border p-2"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          className="w-full border p-2"
          placeholder="Emergency Contact"
          value={emergencyContact}
          onChange={(e) => setEmergencyContact(e.target.value)}
        />

        <button
          onClick={saveDriver}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
