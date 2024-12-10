"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiClock } from "react-icons/fi"; // Import React Icons
import { LiaTimesSolid } from "react-icons/lia";

const RequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState(null);

  // Fetch requests data from the API
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/requests");
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();
        setRequests(data);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to load requests");
      } finally {
        setLoading(false);
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

    fetchUserData();
    fetchRequests();
  }, []);

  const filteredRequests = userData
    ? requests.filter((request) => request.userId === userData.id)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-blue-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="bg-white p-4 shadow rounded-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-700">My Requests</h1>
        <Link
          href={"/user/dashboard/requests/new-request"}
          className="px-4 py-2 bg-blue-700 text-white font-semibold rounded-md shadow hover:bg-blue-800 transition"
        >
          Make New Request
        </Link>
      </header>

      {/* Requests Table */}
      <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full text-center border-collapse border border-gray-200">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="p-4 border border-gray-200">Order ID</th>
              <th className="p-4 border border-gray-200">Blood Group</th>
              <th className="p-4 border border-gray-200">Quantity</th>
              <th className="p-4 border border-gray-200">Request Date</th>
              <th className="p-4 border border-gray-200">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No requests found.
                </td>
              </tr>
            ) : (
              filteredRequests.map((request, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="p-4 border border-gray-200">{request.id}</td>
                  <td className="p-4 border border-gray-200">
                    {request.blood_group}
                  </td>
                  <td className="p-4 border border-gray-200">
                    {request.quantity}
                  </td>
                  <td className="p-4 border border-gray-200">
                    {new Date(request.request_time).toLocaleDateString()}
                  </td>
                  <td className="p-4 border border-gray-200 capitalize">
                    <span
                      className={`border px-3 flex items-center w-max mx-auto text-sm py-1 font-medium capitalize rounded-full border-gray-200 ${
                        request.status === "pending"
                          ? "text-orange-600 bg-orange-100 border-orange-500"
                          : request.status === "approved"
                          ? "text-emerald-600 bg-emerald-100 border-emerald-500"
                          : "text-rose-600 bg-rose-100 border-rose-400"
                      }`}
                    >
                      {request.status === "pending" && (
                        <FiClock className="mr-2 text-orange-600" />
                      )}
                      {request.status === "approved" && (
                        <FiCheckCircle className="mr-2 text-emerald-600" />
                      )}
                      {request.status === "declined" && (
                        <LiaTimesSolid className="mr-2 text-rose-600" />
                      )}
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestPage;
