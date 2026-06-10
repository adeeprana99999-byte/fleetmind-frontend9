"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

import { useEffect, useState } from "react";
//import { API, getData, postData } from "../../lib/api";
import { getData, postData, deleteData } from "../../lib/api";


export default function DriversPage() {
  const [drivers, setDrivers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [showAdd, setShowAdd] = useState(false);

  // Add Driver fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiry, setLicenseExpiry] = useState("");
  const [password, setPassword] = useState("");
  const [licensePhoto, setLicensePhoto] = useState(null);
  const [documents, setDocuments] = useState([]);


  useEffect(() => {
    getData("drivers")
      .then((res) => {
        const list = Array.isArray(res) ? res : [];
        setDrivers(list);
        setFiltered(list);
      })
      .finally(() => setLoading(false));
  }, []);

  // Search filter
  useEffect(() => {
    const s = search.toLowerCase();
    setFiltered(
      drivers.filter((d) => {
        const u = d.userId || {};
        return (
          u.name?.toLowerCase().includes(s) ||
          u.phone?.toLowerCase().includes(s) ||
          d.licenseNumber?.toLowerCase().includes(s)
        );
      })
    );
  }, [search, drivers]);

  const editDriver = (id) => {
    window.location.href = `/drivers/edit?id=${id}`;
  };

 const deleteDriver = async (id) => {
  if (!confirm("Are you sure you want to delete this driver?")) return;

  const res = await deleteData(`drivers/${id}`);

  if (res && !res.error) {
    alert("Driver deleted");
    window.location.reload();
  } else {
    alert("Delete failed");
  }
};
//upload 
  async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", "fleetmind"); // create this in Cloudinary

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload",
    { method: "POST", body: form }
  );

  const data = await res.json();
  return data.secure_url;
}

  // Save new driver
  const saveDriver = async () => {
  console.log("SAVE DRIVER CLICKED");

 const saveDriver = async () => {
  console.log("SAVE DRIVER CLICKED");

  let licensePhotoURL = "";
  let documentURLs = [];

  // Upload license photo
  if (licensePhoto) {
    licensePhotoURL = await uploadFile(licensePhoto);
  }

  // Upload multiple documents
  for (let doc of documents) {
    const url = await uploadFile(doc);
    documentURLs.push(url);
  }

  const res = await postData("drivers", {
    name,
    phone,
    licenseNumber,
    licenseExpiry,
    password,
    licensePhoto: licensePhotoURL,
    documents: documentURLs,
  });

  console.log("ADD DRIVER RESPONSE:", res);

  setShowAdd(false);
  window.location.reload();
};

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Drivers</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search drivers..."
            className="px-4 py-2 border rounded-lg shadow-sm w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
          >
            + Add Driver
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="border-b bg-gray-100 text-gray-700">
              <th className="p-3 text-left font-semibold">Name</th>
              <th className="p-3 text-left font-semibold">Phone</th>
              <th className="p-3 text-left font-semibold">Assigned Vehicle</th>
              <th className="p-3 text-left font-semibold">License #</th>
              <th className="p-3 text-left font-semibold">License Expiry</th>
              <th className="p-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No drivers found.
                </td>
              </tr>
            )}

            {filtered.map((d) => {
              const u = d.userId || {};

              return (
                <tr
                  key={d._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{u.name || "—"}</td>
                  <td className="p-3">{u.phone || "—"}</td>

                  <td className="p-3">
                    {u.assignedVehicle
                      ? u.assignedVehicle.vehicleNumber
                      : "Unassigned"}
                  </td>

                  <td className="p-3">{d.licenseNumber || "—"}</td>

                  <td className="p-3">
                    {d.licenseExpiry
                      ? new Date(d.licenseExpiry).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => editDriver(d._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteDriver(d._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Driver Modal */}
   {/* Add Driver Modal */}
{showAdd && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-bold mb-4">Add Driver</h2>

      <div className="flex flex-col gap-4">

        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <input
            className="w-full border p-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">License Number</label>
          <input
            className="w-full border p-2 rounded"
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">License Expiry</label>
          <input
            type="date"
            className="w-full border p-2 rounded"
            value={licenseExpiry}
            onChange={(e) => setLicenseExpiry(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
  <label className="block text-sm font-medium mb-1">License Photo</label>
  <input
    type="file"
    accept="image/*"
    className="w-full border p-2 rounded"
    onChange={(e) => setLicensePhoto(e.target.files[0])}
  />
</div>

<div>
  <label className="block text-sm font-medium mb-1">Other Documents</label>
  <input
    type="file"
    multiple
    accept="image/*,.pdf"
    className="w-full border p-2 rounded"
    onChange={(e) => setDocuments([...e.target.files])}
  />
</div>

      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => setShowAdd(false)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>

       <button
  type="button"
  onClick={saveDriver}
  className="px-4 py-2 bg-blue-600 text-white rounded"
>
  Save
</button>

      </div>
    </div>
  </div>
)}

    </div>
  );
}
