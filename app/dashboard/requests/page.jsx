"use client";

import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { FiCheckCircle, FiClock } from "react-icons/fi";
import { LiaTimesSolid } from "react-icons/lia";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequestPage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // To filter by status
  const [bloodGroupFilter, setBloodGroupFilter] = useState(""); // To filter by blood group
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/requests");
        const requestData = await response.json();
        setRequests(requestData);

        const userResponse = await fetch("/api/users");
        const userData = await userResponse.json();
        setUsers(userData);
      } catch (error) {
        toast.error("Failed to fetch data", {
          position: "bottom-center",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getUserName = (userId) => {
    const user = users.find((user) => user._id === userId);
    return user ? user.name : "Unknown User";
  };

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      statusFilter === "" ||
      request.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesBloodGroup =
      bloodGroupFilter === "" ||
      request.bloodGroup.toLowerCase().includes(bloodGroupFilter.toLowerCase());
    const matchesSearch = getUserName(request.userId)
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesStatus && matchesBloodGroup && matchesSearch;
  });

  const handleApprove = async (id, bloodGroup, quantity) => {
    try {
      // Call the API to update the status and check stock
      const response = await fetch(`/api/requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bloodGroup,
          quantity,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to approve request");
      }

      // Update the local state to reflect the status change and updatedRequest
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req._id === id ? { ...req, status: "approved" } : req
        )
      );

      toast.success("Request Approved!", {
        position: "bottom-center",
      });
    } catch (error) {
      toast.error(error.message || "Failed to approve request", {
        position: "bottom-center",
      });
    }
  };

  const handleDecline = async (id) => {
    try {
      const response = await fetch(`/api/requests/${id}/decline`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to decline request");
      }

      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id ? { ...request, status: "Declined" } : request
        )
      );

      toast.error("Request Declined", {
        position: "bottom-center",
      });
    } catch (error) {
      toast.error(error.message || "Failed to decline request", {
        position: "bottom-center",
      });
    }
  };

  if (loading) {
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <header className="bg-white p-4 shadow rounded-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-700">Blood Requests</h1>
        <div className="flex gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name"
            className="p-2 border border-gray-300 rounded-lg w-1/3"
          />
          <select
            className="p-2 border border-gray-300 rounded-lg"
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
          >
            <option value="">All Blood Groups</option>
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="O+">O+</option>
            <option value="AB+">AB+</option>
            <option value="A-">A-</option>
            <option value="B-">B-</option>
            <option value="O-">O-</option>
            <option value="AB-">AB-</option>
          </select>
          <select
            className="p-2 border border-gray-300 rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </header>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="p-4 border border-gray-200">ID</th>
              <th className="p-4 border border-gray-200">Requested on</th>
              <th className="p-4 border border-gray-200">From</th>
              <th className="p-4 border border-gray-200">Blood Group</th>
              <th className="p-4 border border-gray-200">Quantity (Units)</th>
              <th className="p-4 border border-gray-200">Status</th>
              <th className="p-4 border border-gray-200 w-[300px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No requests found.
                </td>
              </tr>
            ) : (
              filteredRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-100">
                  <td className="px-4 border text-center border-gray-200">
                    {request._id.toString().slice(-8).toUpperCase()}
                  </td>
                  <td className="py-4 border text-center border-gray-200">
                    {new Date(request.createdAt).toLocaleString()}
                  </td>

                  <td className="px-4 border border-gray-200">
                    {getUserName(request.userId)}
                  </td>
                  <td className="px-4 border text-center border-gray-200">
                    {request.bloodGroup}
                  </td>
                  <td className="px-4 border text-center border-gray-200">
                    {request.quantity}
                  </td>
                  <td className={`px-4 border border-gray-200`}>
                    <span
                      className={`border px-3 flex items-center w-max mx-auto capitalize text-sm py-1 font-medium rounded-full border-gray-200 ${
                        request.status === "pending"
                          ? "text-orange-600 bg-orange-100 border-orange-400"
                          : request.status === "approved"
                          ? "text-emerald-600 bg-emerald-100 border-emerald-600"
                          : "text-red-600 bg-red-100 border-red-400"
                      }`}
                    >
                      {request.status === "pending" && (
                        <FiClock className="mr-2" />
                      )}
                      {request.status === "approved" && (
                        <FiCheckCircle className="mr-2 text-emerald-600" />
                      )}
                      {request.status === "declined" && (
                        <LiaTimesSolid className="mr-2 text-red-600" />
                      )}
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 border border-gray-200">
                    {request.status === "pending" ? (
                      <div className="flex justify-center gap-2">
                        <button
                          className="px-3 text-sm py-1 flex items-center gap-1 font-medium hover:text-white rounded-full bg-blue-600 text-white border border-blue-600 cursor-pointer hover:bg-blue-700"
                          onClick={() =>
                            handleApprove(
                              request._id,
                              request.bloodGroup,
                              request.quantity
                            )
                          }
                        >
                          <FaCheck />
                          Approve
                        </button>
                        <button
                          className="px-3 text-sm py-1 flex items-center gap-1 font-medium hover:text-white rounded-full bg-red-600 text-white border border-red-600 cursor-pointer hover:bg-red-700"
                          onClick={() => handleDecline(request._id)}
                        >
                          <LiaTimesSolid />
                          Decline
                        </button>
                      </div>
                    ) : (
                      <p className="italic text-center text-gray-500">
                        No action required!
                      </p>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default RequestPage;
