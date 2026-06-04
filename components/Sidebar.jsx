import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white shadow-md p-6">
      <h1 className="text-2xl font-bold mb-8">FleetMind</h1>

      <nav className="flex flex-col gap-4">
        <Link href="/vehicles">Vehicles</Link>
        <Link href="/drivers">Drivers</Link>
        <Link href="/income">Income</Link>
        <Link href="/expenses">Expenses</Link>
        <Link href="/receipts">Receipts</Link>
      </nav>
    </div>
  );
}
