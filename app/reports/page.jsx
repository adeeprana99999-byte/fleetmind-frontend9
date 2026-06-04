"use client";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;
import { useEffect, useState } from "react";
import { getData } from "../../lib/api";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    getData("income").then(setIncome);
    getData("expenses").then(setExpenses);
  }, []);

  // calculations...
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = totalIncome - totalExpenses;

  const months = Array.from({ length: 12 }, (_, i) => i);
  const monthlyIncome = months.map((m) =>
    income.filter((i) => new Date(i.date).getMonth() === m)
          .reduce((sum, i) => sum + i.amount, 0)
  );
  const monthlyExpenses = months.map((m) =>
    expenses.filter((e) => new Date(e.date).getMonth() === m)
            .reduce((sum, e) => sum + e.amount, 0)
  );

  const expenseCategories = {};
  expenses.forEach((e) => {
    expenseCategories[e.category] = (expenseCategories[e.category] || 0) + e.amount;
  });

  return (
    <div>
      {/* SUMMARY CARDS */}
      ...your existing summary cards...

      {/* MONTHLY TREND CHART */}
      ...your Line chart...

      {/* EXPENSE CATEGORY PIE CHART */}
      ...your Pie chart...

      {/* PROFIT PER VEHICLE TABLE */}
      <div className="bg-white p-6 shadow rounded mb-6">
        <h3 className="font-semibold mb-4">Profit per Vehicle</h3>

        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">Vehicle</th>
              <th className="p-3 text-left">Income</th>
              <th className="p-3 text-left">Expenses</th>
              <th className="p-3 text-left">Profit</th>
              <th className="p-3 text-left">Margin</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(
              income.reduce((acc, i) => {
                const id = i.vehicleId?._id;
                if (!id) return acc;
                acc[id] = acc[id] || { vehicle: i.vehicleId, income: 0, expenses: 0 };
                acc[id].income += i.amount;
                return acc;
              }, {})
            ).map(([vehicleId, data]) => {
              expenses.forEach((e) => {
                if (e.vehicleId?._id === vehicleId) {
                  data.expenses += e.amount;
                }
              });

              const profit = data.income - data.expenses;
              const margin =
                data.income > 0
                  ? ((profit / data.income) * 100).toFixed(1) + "%"
                  : "—";

              return (
                <tr key={vehicleId} className="border-b hover:bg-gray-50">
                  <td className="p-3">{data.vehicle.vehicleNumber}</td>
                  <td className="p-3 text-green-600 font-semibold">
                    ${data.income.toFixed(2)}
                  </td>
                  <td className="p-3 text-red-600 font-semibold">
                    ${data.expenses.toFixed(2)}
                  </td>
                  <td
                    className={`p-3 font-semibold ${
                      profit >= 0 ? "text-blue-600" : "text-red-600"
                    }`}
                  >
                    ${profit.toFixed(2)}
                  </td>
                  <td className="p-3">{margin}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
