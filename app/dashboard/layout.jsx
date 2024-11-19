"use client";

import jwt from "jsonwebtoken";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DashboardLayout = ({ children }) => {
  const pathname = usePathname(); // Get the current path
  const router = useRouter(); // Router for redirection
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication
  const [isLoading, setIsLoading] = useState(true); // Loading state to handle token validation

  const menuItems = [
    { name: "Home", path: "/dashboard" },
    { name: "Donor Management", path: "/dashboard/donors" },
    { name: "Blood Stock", path: "/dashboard/blood-stock" },
    { name: "Requests", path: "/dashboard/requests" },
  ];

  // Function to validate the JWT token
  const validateToken = () => {
    const token = localStorage.getItem("token"); // Get token from localStorage or cookies
    if (!token) {
      return false; // No token, invalid
    }

    try {
      // Validate the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // You can use the same secret as in your API
      return decoded ? true : false; // If decoded is truthy, token is valid
    } catch (error) {
      console.error("Invalid token:", error);
      return false; // Invalid token
    }
  };

  useEffect(() => {
    // On initial render, validate the token
    const isValid = validateToken();
    if (!isValid) {
      router.push("/"); // Redirect to login if token is invalid or missing
    } else {
      setIsAuthenticated(true); // Token is valid
    }
    setIsLoading(false); // Finish loading after token validation
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p> {/* You can replace this with a spinner */}
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Optionally render nothing until authentication is checked
  }

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
