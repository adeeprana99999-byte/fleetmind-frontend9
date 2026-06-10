"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
export const dynamicParams = true;
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getData } from "../../../lib/api";
export default function VehicleDetailsPage() {
  const params = useSearchParams();
  const id = params.get("id");

  const [vehicle, setVehicle] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);

  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    if (!id) return;

    Promise.all([
      getData(`vehicles/${id}`),
      getData(`expenses/vehicle/${id}`),
      getData(`income/vehicle/${id}`),
    ]).then(([veh, exp, inc]) => {
      setVehicle(veh);
      setExpenses(exp);
      setIncome(inc);

     setTotalExpenses(
  exp
    .filter(e => e.status !== "Rejected")   // ⭐ ignore rejected
    .reduce((s, e) => s + Number(e.amount || 0), 0)
);

      setTotalIncome(inc.reduce((s, i) => s + Number(i.amount), 0));
    });
  }, [id]);

  if (!vehicle) return <p className="p-6">Loading...</p>;

  const net = totalIncome - totalExpenses;

  return (
    <div className="p-6">
      <button
        onClick={() => (window.location.href = "/vehicles")}
        className="mb-4 px-4 py-2 bg-gray-200 rounded"
      >
        ← Back to Vehicles
      </button>

      <h1 className="text-2xl font-bold mb-4">
        Vehicle Details — {vehicle.vehicleNumber}
      </h1>

      {/* VEHICLE INFO */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Vehicle Information</h2>

        <p><strong>Make:</strong> {vehicle.make}</p>
        <p><strong>Model:</strong> {vehicle.model}</p>
        <p><strong>Year:</strong> {vehicle.year}</p>
        <p><strong>Status:</strong> {vehicle.status}</p>
        <p><strong>Mileage:</strong> {vehicle.mileage || 0}</p>


        <p className="mt-3">
          <strong>Assigned Driver:</strong>{" "}
          {vehicle.assignedDriver?.userId?.name || "Unassigned"}
        </p>
      </div>

      {/* TOTALS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Total Income</h2>
          <p className="text-green-600 text-2xl font-bold">
            ${totalIncome.toFixed(2)}
          </p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Total Expenses</h2>
          <p className="text-red-600 text-2xl font-bold">
            ${totalExpenses.toFixed(2)}
          </p>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Net Profit</h2>
          <p
            className={`text-2xl font-bold ${
              net >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            ${net.toFixed(2)}
          </p>
        </div>
      </div>

      {/* INCOME HISTORY */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-3">Income History</h2>

        {income.length === 0 ? (
          <p>No income recorded for this vehicle.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Notes</th>
              </tr>
            </thead>

            <tbody>
              {income.map((i) => (
                <tr key={i._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold text-green-600">
                    ${Number(i.amount).toFixed(2)}
                  </td>
                  <td className="p-3">{i.category}</td>
                  <td className="p-3">
                    {new Date(i.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">{i.notes || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* EXPENSE HISTORY */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-3">Expense History</h2>

        {expenses.length === 0 ? (
          <p>No expenses recorded for this vehicle.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((e) => (
                <tr key={e._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-semibold text-red-600">
                    ${Number(e.amount).toFixed(2)}
                  </td>
                  <td className="p-3">{e.category}</td>
                  <td className="p-3">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">{e.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
