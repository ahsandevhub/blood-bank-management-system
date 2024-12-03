"use client";

import { useRouter } from "next/navigation"; // Import useRouter hook
import { useState } from "react";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize the router for redirection

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/user-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");
        // Store the token securely (e.g., in cookies or localStorage)
        localStorage.setItem("userToken", data.token);
        // Redirect to the dashboard page after successful login
        router.push("/user/dashboard");
      } else {
        setMessage(data.error || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex items-center justify-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('../images/bg2.png')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-50"></div>
      <div className="relative z-10 bg-white/90 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-3">
          Blood Bank Management System
        </h2>
        <h3 className="mb-5 text-lg font-bold flex justify-center">
          <span className="bg-blue-600 text-white py-2 px-5 rounded-lg">
            User Login
          </span>
        </h3>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className={`w-full ${
              loading
                ? "bg-blue-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 rounded-lg transition duration-200`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("successful")
                ? "text-green-600"
                : "text-blue-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
