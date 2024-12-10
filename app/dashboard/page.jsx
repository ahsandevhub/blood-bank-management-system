"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [donors, setDonors] = useState([]);
  const [users, setUsers] = useState([]);
  const [bloodStock, setBloodStock] = useState([]);
  const [loadingDonors, setLoadingDonors] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingStock, setLoadingStock] = useState(true);
  const [error, setError] = useState(null);

  // Fetch donors data from the API
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoadingDonors(true);
        const response = await fetch("/api/donors");
        if (!response.ok) throw new Error("Failed to fetch donors");
        const data = await response.json();
        setDonors(data);
      } catch (error) {
        console.error("Error fetching donors:", error);
        setError("Failed to load donors data");
      } finally {
        setLoadingDonors(false);
      }
    };
    fetchDonors();
  }, []);

  // Fetch users data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users data");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
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

  if (loadingDonors || loadingUsers || loadingStock) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Page Header */}
      <header className="bg-white p-4 shadow rounded-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-700">
          Blood Bank Dashboard
        </h1>
        <Link
          href={"/dashboard/blood-stock/add-stock"}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700"
        >
          Add Blood Stock
        </Link>
      </header>

      {/* Dashboard Content */}
      <main className="grid grid-cols-3 gap-6 mt-6">
        {/* Donor Statistics */}
        <div className="bg-white p-6 shadow rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Donor Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Registered Donors</span>
              <span className="font-bold text-red-600">{donors.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Donors</span>
              <span className="font-bold text-green-600">
                {donors.filter((item) => item.status === "active").length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Inactive Donors</span>
              <span className="font-bold text-gray-400">
                {donors.filter((item) => item.status === "inactive").length}
              </span>
            </div>
          </div>
        </div>

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
                <span className="font-medium text-gray-600">{stock.group}</span>
                <span className="font-bold text-gray-700">
                  {stock.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 2xl:col-span-1 col-span-3 shadow rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Activities
          </h2>
          <ul className="space-y-3">
            {donors.length > 0 && (
              <li className="text-sm text-gray-600">
                <span className="font-bold text-gray-800">
                  New donor added:
                </span>{" "}
                {`${donors[donors.length - 1].name} (${
                  donors[donors.length - 1].bloodType
                })`}
              </li>
            )}
            {users.length > 0 && (
              <li className="text-sm text-gray-600">
                <span className="font-bold text-gray-800">
                  New user registered:
                </span>{" "}
                {`${users[users.length - 1].fullName} (${
                  users[users.length - 1].bloodGroup
                })`}
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
