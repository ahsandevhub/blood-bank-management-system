"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const UserDashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [donors, setDonors] = useState([]);
  const [loadingStock, setLoadingStock] = useState(true);
  const [bloodStock, setBloodStock] = useState([]);

  // Fetch donors data from the API
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch("/api/donors");
        if (!response.ok) throw new Error("Failed to fetch donors");
        const data = await response.json();
        setDonors(data);
      } catch (error) {
        console.error("Error fetching donors:", error);
        setError("Failed to load donors data");
      }
    };

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        if (!token) {
          setError("User token is missing. Please log in again.");
          return;
        }

        const response = await axios.get("/api/register-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError("Failed to fetch user details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
    fetchUserData();
  }, []);

  // Fetch blood stock data from the API
  useEffect(() => {
    const fetchBloodStock = async () => {
      try {
        setLoadingStock(true);
        const response = await fetch("/api/blood-stock");
        if (!response.ok) throw new Error("Failed to fetch blood stock");
        const data = await response.json();
        setBloodStock(data);
      } catch (error) {
        console.error("Error fetching blood stock:", error);
        setError("Failed to load blood stock data");
      } finally {
        setLoadingStock(false);
      }
    };
    fetchBloodStock();
  }, []);

  // Calculate blood stock quantities
  const calculateBloodStock = () => {
    const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    return bloodGroups.map((group) => ({
      group,
      quantity: bloodStock
        .filter((stock) => stock.bloodGroup === group)
        .reduce((sum, stock) => sum + Number(stock.quantity), 0), // Convert to number
    }));
  };

  const bloodStockSummary = calculateBloodStock();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-blue-700 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-700">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <header className="bg-blue-700 text-white p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold">
          Welcome, {userData?.name || "User"}!
        </h1>
        <p className="mt-2 text-sm">
          Manage your blood donation activities effortlessly.
        </p>
      </header>

      <div className="mt-5 space-y-6">
        <header className="bg-white p-4 shadow rounded-md flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">
            Active Blood Stock
          </h1>
        </header>

        <div className="grid grid-cols-2 gap-6">
          {/* Blood Stock */}
          <div className="bg-white 2xl:col-span-1 col-span-2 p-6 shadow rounded-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Blood Stock Summary (Units)
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {bloodStockSummary.map((stock) => (
                <div
                  key={stock.group}
                  className="flex justify-between p-3 border rounded-md"
                >
                  <span className="font-medium text-gray-600">
                    {stock.group}
                  </span>
                  <span className="font-bold text-gray-700">
                    {stock.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href={"/user/dashboard/requests/new-request"}
                className="px-6 inline-block mt-5 w-max py-3 bg-blue-700 text-white font-semibold rounded-md shadow hover:bg-blue-800 transition"
              >
                Make New Request
              </Link>
            </div>
          </div>

          {/* Donors List */}
          <div className="bg-white 2xl:col-span-1 col-span-2 h-max p-6 shadow rounded-md">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Donors List
            </h2>
            <div className="overflow-x-auto bg-white">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 border border-gray-200 text-left">
                      Name
                    </th>
                    <th className="p-4 border border-gray-200 text-left">
                      Blood Group
                    </th>
                    <th className="p-4 border border-gray-200 text-left">
                      Status
                    </th>
                    <th className="p-4 border border-gray-200 text-left">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {donors.length > 0 ? (
                    donors.map((donor) => (
                      <tr key={donor._id} className="hover:bg-gray-100">
                        <td className="p-4 border border-gray-200">
                          {donor.name}
                        </td>
                        <td className="p-4 border border-gray-200">
                          {donor.bloodType}
                        </td>
                        <td
                          className={`p-4 border capitalize border-gray-200 font-semibold ${
                            donor.status === "active"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {donor.status}
                        </td>
                        <td className="p-4 border border-gray-200">
                          {donor.phone}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-4 text-center text-gray-500 border border-gray-200"
                      >
                        No donors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
