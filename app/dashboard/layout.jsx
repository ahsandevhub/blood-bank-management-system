"use client";

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
    { name: "Blood Stock Management", path: "/dashboard/blood-stock" },
    { name: "Donor Management", path: "/dashboard/donors" },
    { name: "Registered Users", path: "/dashboard/registered-users" },
    { name: "Requests", path: "/dashboard/requests" },
  ];

  // Function to validate the token via API
  const validateToken = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      return false; // No token found
    }

    try {
      const response = await fetch("/api/auth/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.isValid;
      }
      return false; // Token is invalid
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("adminToken"); // Remove token from localStorage
    router.push("/"); // Redirect to the login page
  };

  useEffect(() => {
    const authenticate = async () => {
      const isValid = await validateToken();
      if (!isValid) {
        router.push("/"); // Redirect to login if invalid
      } else {
        setIsAuthenticated(true); // Token is valid
      }
      setIsLoading(false); // Stop loading
    };

    authenticate(); // Validate token on mount
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Optionally render nothing until authenticated
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="sticky top-0 w-64 bg-red-700 text-white shadow-lg flex flex-col">
        <div className="p-4 font-bold text-xl text-center border-b border-red-500">
          Blood Bank System
        </div>
        <nav className="mt-4 flex-1">
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
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 bg-red-800 hover:bg-red-600 text-sm font-semibold text-center"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <main>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
