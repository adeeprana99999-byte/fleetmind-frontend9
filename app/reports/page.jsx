"use client";

import { useEffect, useState } from "react";
import { getData } from "../../lib/api";
import { Line, Pie, Bar } from "react-chartjs-2";
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

  // --- CALCULATIONS ---
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = totalIncome - totalExpenses;

  // Monthly aggregation
  const months = Array.from({ length: 12 }, (_, i) => i);
  const monthlyIncome = months.map((m) =>
    income
      .filter((i) => new Date(i.date).getMonth() === m)
      .reduce((sum, i) => sum + i.amount, 0)
  );
  const monthlyExpenses = months.map((m) =>
    expenses
      .filter((e) => new Date(e.date).getMonth() === m)
      .reduce((sum, e) => sum + e.amount, 0)
  );

  // Category breakdown
  const expenseCategories = {};
  expenses.forEach((e) => {
    expenseCategories[e.category] = (expenseCategories[e.category] || 0) + e.amount;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profitability Reports</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold">Total Income</h3>
          <p className="text-green-600 text-xl font-bold">${totalIncome.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold">Total Expenses</h3>
          <p className="text-red-600 text-xl font-bold">${totalExpenses.toFixed(2)}</p>
        </div>

        <div className="bg-white p-4 shadow rounded">
          <h3 className="font-semibold">Profit</h3>
          <p className="text-blue-600 text-xl font-bold">${profit.toFixed(2)}</p>
        </div>
      </div>

      {/* MONTHLY TREND CHART */}
      <div className="bg-white p-6 shadow rounded mb-6">
        <h3 className="font-semibold mb-4">Monthly Income vs Expenses</h3>
        <Line
          data={{
            labels: [
              "Jan", "Feb", "Mar", "Apr", "May", "Jun",
              "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ],
            datasets: [
              {
                label: "Income",
                data: monthlyIncome,
                borderColor: "green",
                backgroundColor: "rgba(0, 128, 0, 0.2)",
              },
              {
                label: "Expenses",
                data: monthlyExpenses,
                borderColor: "red",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
              },
            ],
          }}
        />
      </div>

      {/* EXPENSE CATEGORY PIE CHART */}
      <div className="bg-white p-6 shadow rounded mb-6">
        <h3 className="font-semibold mb-4">Expense Breakdown</h3>
        <Pie
          data={{
            labels: Object.keys(expenseCategories),
            datasets: [
              {
                data: Object.values(expenseCategories),
                backgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56",
                  "#4BC0C0",
                  "#9966FF",
                  "#FF9F40",
                ],
              },
            ],
          }}
        />
      </div>
    </div>
  );
}
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
          const id = i.vehicleId?._id
          if (!id) return acc
          acc[id] = acc[id] || { vehicle: i.vehicleId, income: 0, expenses: 0 }
          acc[id].income += i.amount
          return acc
        }, {})
      ).map(([vehicleId, data]) => {
        // Add expenses
        expenses.forEach((e) => {
          if (e.vehicleId?._id === vehicleId) {
            data.expenses += e.amount
          }
        })

        const profit = data.income - data.expenses
        const margin =
          data.income > 0 ? ((profit / data.income) * 100).toFixed(1) + "%" : "—"

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
        )
      })}
    </tbody>
  </table>
</div>
