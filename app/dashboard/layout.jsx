"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const pathname = usePathname(); // Get the current path

  const menuItems = [
    { name: "Home", path: "/dashboard" },
    { name: "Donor Management", path: "/dashboard/donors" },
    { name: "Blood Stock", path: "/dashboard/blood-stock" },
    { name: "Requests", path: "/dashboard/requests" },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="sticky top-0 w-64 bg-red-700 text-white shadow-lg">
        <div className="p-4 font-bold text-xl text-center border-b border-red-500">
          Blood Bank System
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className={`block px-4 py-3 text-sm font-semibold ${
                    pathname === item.path ? "bg-red-800" : "hover:bg-red-600"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        {/* Page Content */}
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
