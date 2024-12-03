"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UserDashboardLayout = ({ children }) => {
  const pathname = usePathname(); // Get the current path
  const router = useRouter(); // Router for redirection
  const [isAuthenticated, setIsAuthenticated] = useState(false); // State to track authentication
  const [isLoading, setIsLoading] = useState(true); // Loading state to handle token validation

  const menuItems = [
    { name: "Home", path: "/user/dashboard" },
    { name: "My Requests", path: "/user/dashboard/my-requests" },
    { name: "Donation History", path: "/user/dashboard/donation-history" },
    { name: "Profile", path: "/user/dashboard/profile" },
  ];

  // Function to validate the token via API
  const validateToken = async () => {
    const token = localStorage.getItem("userToken");
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
    localStorage.removeItem("userToken"); // Remove token from localStorage
    router.push("/user"); // Redirect to the login page
  };

  useEffect(() => {
    const authenticate = async () => {
      const isValid = await validateToken();
      if (!isValid) {
        router.push("/user"); // Redirect to login if invalid
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
      <aside className="sticky top-0 w-64 bg-blue-700 text-white shadow-lg flex flex-col">
        <div className="p-4 font-bold text-xl text-center border-b border-blue-500">
          Blood Bank System
        </div>
        <nav className="mt-4 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  className={`block px-4 py-3 text-sm font-semibold ${
                    pathname === item.path ? "bg-blue-800" : "hover:bg-blue-600"
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
          className="w-full px-4 py-3 bg-blue-800 hover:bg-blue-600 text-sm font-semibold text-center"
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

export default UserDashboardLayout;
