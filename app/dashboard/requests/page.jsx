"use client";

import { useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { FiCheckCircle, FiClock } from "react-icons/fi"; // Import React Icons
import { toast, ToastContainer } from "react-toastify"; // Import React Toastify
import "react-toastify/dist/ReactToastify.css"; // Import the Toastify CSS

const RequestPage = () => {
  const [search, setSearch] = useState("");
  const [requests, setRequests] = useState([
    {
      id: 1,
      from: "City Hospital",
      bloodGroup: "A+",
      quantity: 2,
      status: "Pending",
    },
    {
      id: 2,
      from: "Popular Diagnostic Center",
      bloodGroup: "B-",
      quantity: 1,
      status: "Fulfilled",
    },
    {
      id: 3,
      from: "Ibne Sina Central Hospital",
      bloodGroup: "O+",
      quantity: 5,
      status: "Pending",
    },
    {
      id: 4,
      from: "Islami Bank Hospital",
      bloodGroup: "AB+",
      quantity: 3,
      status: "Fulfilled",
    },
    {
      id: 5,
      from: "Mugda Hospital",
      bloodGroup: "A-",
      quantity: 1,
      status: "Pending",
    },
  ]);

  const filteredRequests = requests.filter((request) =>
    request.bloodGroup.toLowerCase().includes(search.toLowerCase())
  );

  // Handle approve button click
  const handleApprove = (id) => {
    setRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === id
          ? { ...request, status: "Approved" } // Set status to Approved temporarily
          : request
      )
    );

    // Show success notification
    toast.success("Request Approved!", {
      autoClose: 3000, // Auto close after 3 seconds
    });

    // After 3 seconds, change the status to Fulfilled
    setTimeout(() => {
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id
            ? { ...request, status: "Fulfilled" } // Change to Fulfilled after Approved
            : request
        )
      );
    }, 3000);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <header className="bg-white p-4 shadow rounded-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-700">Blood Requests</h1>
      </header>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Blood Group"
          className="p-2 border border-gray-300 rounded-lg w-1/3"
        />
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="p-4 border border-gray-200 text-left">From</th>
              <th className="p-4 border border-gray-200 text-left">
                Blood Group
              </th>
              <th className="p-4 border border-gray-200 text-left">
                Quantity (Units)
              </th>
              <th className="p-4 border border-gray-200 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((request) => (
              <tr key={request.id} className="hover:bg-gray-100">
                <td className="p-4 border border-gray-200">{request.from}</td>
                <td className="p-4 border border-gray-200">
                  {request.bloodGroup}
                </td>
                <td className="p-4 border border-gray-200">
                  {request.quantity}
                </td>
                <td
                  className={`p-4 border border-gray-200 space-x-3 flex items-center ${
                    request.status === "Pending"
                      ? "text-yellow-500"
                      : request.status === "Fulfilled"
                      ? "text-green-500"
                      : "text-blue-500"
                  }`}
                >
                  <span
                    className={`border px-3 flex items-center text-sm py-1 font-medium rounded-full border-gray-200 ${
                      request.status === "Pending"
                        ? "text-rose-600 bg-rose-100 border-rose-300"
                        : request.status === "Approved"
                        ? "text-blue-600 bg-blue-100 border-blue-300"
                        : "text-emerald-600 bg-emerald-100 border-emerald-300"
                    }`}
                  >
                    {request.status === "Pending" && (
                      <FiClock className="mr-2" />
                    )}
                    {request.status === "Approved" && (
                      <FiCheckCircle className="mr-2 text-blue-600" />
                    )}
                    {request.status === "Fulfilled" && (
                      <FiCheckCircle className="mr-2 text-green-600" />
                    )}{" "}
                    {request.status}
                  </span>
                  {request.status === "Pending" && (
                    <span
                      className="px-3 text-sm py-1 flex items-center gap-1 font-medium hover:text-white rounded-full bg-gray-100 text-gray-800 border border-gray-300 cursor-pointer hover:bg-gray-600"
                      onClick={() => handleApprove(request.id)}
                    >
                      <FaCheck />
                      Approve
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ToastContainer to render the notifications */}
      <ToastContainer />
    </div>
  );
};

export default RequestPage;
