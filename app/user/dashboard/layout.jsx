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
    // { name: "My Requests", path: "/user/dashboard/my-requests" },
    // { name: "Donation History", path: "/user/dashboard/donation-history" },
    { name: "Profile", path: "/user/dashboard/profile" },
    { name: "Requests", path: "/user/dashboard/requests" },
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        {/* Heartbeat Monitor */}
        <div className="relative w-full max-w-xl h-24">
          {/* Line */}
          <div className="absolute top-1/2 w-full border-t-2 border-red-300"></div>

          {/* Heartbeat SVG Line */}
          <svg
            className="w-full h-full animate-heartbeat"
            viewBox="0 0 500 100"
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              stroke="#dc2626"
              strokeWidth="3"
              points="0,50 50,50 70,20 90,80 110,50 200,50 220,30 240,70 260,50 500,50"
            />
          </svg>

          {/* Blood Drop at Pulse */}
          <div className="absolute left-[90px] top-[30px] animate-drop">
            <div
              className="w-4 h-6 bg-red-600 rounded-full transform rotate-180 drop-shadow-lg"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            ></div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="mt-10 text-xl text-red-600 font-bold tracking-wide animate-pulse">
          Checking vital signs...
        </p>

        {/* Custom animations */}
        <style jsx>{`
          @keyframes heartbeat {
            0% {
              stroke-dashoffset: 1000;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }

          @keyframes drop {
            0%,
            70% {
              opacity: 0;
              transform: translateY(0) scale(1) rotate(180deg);
            }
            80% {
              opacity: 1;
              transform: translateY(0) scale(1.2) rotate(180deg);
            }
            100% {
              opacity: 0;
              transform: translateY(20px) scale(0.8) rotate(180deg);
            }
          }

          .animate-heartbeat polyline {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: heartbeat 2s linear infinite;
          }

          .animate-drop {
            animation: drop 2s infinite ease-in-out;
          }
        `}</style>
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
