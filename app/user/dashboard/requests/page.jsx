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
    ? requests.filter((request) => request.userId === userData._id)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
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
                  <td className="p-4 border border-gray-200">
                    {request._id.toString().slice(-8).toUpperCase()}
                  </td>
                  <td className="p-4 border border-gray-200">
                    {request.bloodGroup}
                  </td>
                  <td className="p-4 border border-gray-200">
                    {request.quantity}
                  </td>
                  <td className="p-4 border border-gray-200">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 border border-gray-200 capitalize">
                    <span
                      className={`border px-3 flex items-center w-max mx-auto text-sm py-1 font-medium capitalize rounded-full border-gray-200 ${
                        request.status === "pending"
                          ? "text-orange-600 bg-orange-100 border-orange-500"
                          : request.status === "approved"
                          ? "text-emerald-600 bg-emerald-100 border-green-500"
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
