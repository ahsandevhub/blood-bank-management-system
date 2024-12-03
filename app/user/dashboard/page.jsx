"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const UserDashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const bloodStock = [
    { id: 1, bloodGroup: "A+", quantity: 10 },
    { id: 2, bloodGroup: "A-", quantity: 5 },
    { id: 3, bloodGroup: "B+", quantity: 8 },
    { id: 4, bloodGroup: "B-", quantity: 3 },
    { id: 5, bloodGroup: "O+", quantity: 15 },
    { id: 6, bloodGroup: "O-", quantity: 2 },
    { id: 7, bloodGroup: "AB+", quantity: 6 },
    { id: 8, bloodGroup: "AB-", quantity: 1 },
  ];

  const filteredStock = bloodStock.filter((item) =>
    item.bloodGroup.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("userToken"); // Retrieve token from localStorage
        if (!token) {
          setError("User token is missing. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.get("/api/register-user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setError("Failed to fetch user details. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
          Welcome, {userData?.fullName || "User"}!
        </h1>
        <p className="mt-2 text-sm">
          Manage your blood donation activities effortlessly.
        </p>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-4 rounded-md shadow-md text-center">
          <h2 className="text-lg font-bold text-blue-700">Total Donations</h2>
          <p className="text-2xl font-semibold mt-2">
            {userData?.totalDonations || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md text-center">
          <h2 className="text-lg font-bold text-blue-700">Pending Requests</h2>
          <p className="text-2xl font-semibold mt-2">
            {userData?.pendingRequests || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md text-center">
          <h2 className="text-lg font-bold text-blue-700">Blood Group</h2>
          <p className="text-2xl font-semibold mt-2">
            {userData?.bloodGroup || "N/A"}
          </p>
        </div>
      </section>

      <div className="mt-5 space-y-6">
        <header className="bg-white p-4 shadow rounded-md flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">Blood Stock</h1>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Blood Group"
            className="p-2 border border-gray-300 rounded-lg w-1/3"
          />
        </header>

        {/* Blood Stock Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="p-4 border border-gray-200 text-left">
                  Blood Group
                </th>
                <th className="p-4 border border-gray-200 text-left">
                  Quantity (Units)
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((stock) => (
                <tr key={stock.id} className="hover:bg-gray-100">
                  <td className="p-4 border border-gray-200">
                    {stock.bloodGroup}
                  </td>
                  <td className="p-4 border border-gray-200">
                    {stock.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links Section */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-700">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <a
            href="/user-dashboard/my-requests"
            className="block bg-blue-700 text-white p-4 rounded-md text-center font-semibold hover:bg-blue-600"
          >
            My Requests
          </a>
          <a
            href="/user-dashboard/donation-history"
            className="block bg-blue-700 text-white p-4 rounded-md text-center font-semibold hover:bg-blue-600"
          >
            Donation History
          </a>
          <a
            href="/user-dashboard/profile"
            className="block bg-blue-700 text-white p-4 rounded-md text-center font-semibold hover:bg-blue-600"
          >
            Profile
          </a>
          <a
            href="/user-dashboard/request-blood"
            className="block bg-blue-700 text-white p-4 rounded-md text-center font-semibold hover:bg-blue-600"
          >
            Request Blood
          </a>
        </div>
      </section>
    </div>
  );
};

export default UserDashboardPage;
