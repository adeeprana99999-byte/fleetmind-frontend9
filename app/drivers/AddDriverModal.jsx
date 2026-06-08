"use client";

export default function AddDriverModal({
  onClose,
  onSave,
  name,
  setName,
  phone,
  setPhone,
  licenseNumber,
  setLicenseNumber,
  licenseExpiry,
  setLicenseExpiry,
  password,
  setPassword,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">Add Driver</h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          placeholder="License Number"
          value={licenseNumber}
          onChange={(e) => setLicenseNumber(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          type="date"
          value={licenseExpiry}
          onChange={(e) => setLicenseExpiry(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
