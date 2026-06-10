import "./globals.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en">
      <body className="bg-gray-100">
        {isLoginPage ? (
          // Login page → no sidebar, no topbar
          <div className="min-h-screen flex items-center justify-center">
            {children}
          </div>
        ) : (
          // All other pages → show dashboard layout
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1">
              <Topbar />
              <main className="p-6">{children}</main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
