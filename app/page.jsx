"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter hook
import { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Initialize the router for redirection

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and redirect
      localStorage.setItem("adminToken", data.token);
      router.push("/dashboard");
    } catch (error) {
      setMessage(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative bg-gray-100 flex items-center justify-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('./images/bg2.png')" }}
    >
      <div className="absolute top-0 right-0 z-50 m-5">
        <Link
          href="/user"
          className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition duration-200"
        >
          User Login
        </Link>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 opacity-50"></div>
      <div className="relative z-10 bg-white/90 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-red-700 mb-3">
          Blood Bank Management System
        </h2>
        <h3 className="mb-5 text-lg font-bold flex justify-center">
          <span className="bg-red-600 text-white py-2 px-5 rounded-lg">
            Admin Login
          </span>
        </h3>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
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
              placeholder="******"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            type="submit"
            className={`w-full ${
              loading
                ? "bg-red-500 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            } text-white font-semibold py-2 rounded-lg transition duration-200`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes("successful") ? "text-green-600" : "text-red-600"
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
