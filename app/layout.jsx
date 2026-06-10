import "./globals.css";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex bg-gray-100">
        <Sidebar />
        <div className="flex-1">
          <Topbar />
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
