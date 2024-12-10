"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

const DonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Fetch donors data from the API on component mount
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch("/api/donors"); // Adjust the API URL as needed
        if (!response.ok) {
          throw new Error("Failed to fetch donors.");
        }
        const data = await response.json();
        setDonors(data);
      } catch (error) {
        console.error("Error fetching donors:", error);
      }
    };

    fetchDonors();
  }, []);

  // Filter donors based on search query, blood group, and status
  const filteredDonors = donors.filter(
    (donor) =>
      (donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.bloodType.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedBloodType ? donor.bloodType === selectedBloodType : true) &&
      (selectedStatus ? donor.status === selectedStatus : true)
  );

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <header className="bg-white p-4 shadow rounded-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-700">Donors List</h1>
        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-4">
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={selectedBloodType}
              onChange={(e) => setSelectedBloodType(e.target.value)}
              aria-label="Filter by Blood Group"
            >
              <option value="">Filter by Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
            <select
              className="p-2 border border-gray-300 rounded-lg"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by Status"
            >
              <option value="">Filter by Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <input
              type="text"
              placeholder="Search by name or blood group"
              className="p-2 border border-gray-300 rounded-lg w-1/3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search donors"
            />
          </div>
          <Link
            href={"/dashboard/add-donor"}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700"
          >
            Add New Donor
          </Link>
        </div>
      </header>

      {/* Donors Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="p-4 border border-gray-200 text-left">Name</th>
              <th className="p-4 border border-gray-200 text-left">
                Blood Group
              </th>
              <th className="p-4 border border-gray-200 text-left">Status</th>
              <th className="p-4 border border-gray-200 text-left">Contact</th>
              <th className="p-4 border border-gray-200 w-[200px] text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.length > 0 ? (
              filteredDonors.map((donor) => (
                <tr key={donor.id} className="hover:bg-gray-100">
                  <td className="p-4 border border-gray-200">{donor.name}</td>
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
                  <td className="p-4 border border-gray-200">{donor.phone}</td>
                  <td className="p-4 text-center w-32 border border-gray-200">
                    <div className="flex justify-center gap-3">
                      <Link
                        href={`/dashboard/donors/${donor.id}`}
                        className="bg-blue-200 border-blue-300 hover:bg-blue-600 hover:text-white transition-all border text-blue-600 px-3 py-2 rounded-md font-semibold flex items-center justify-center"
                        title="View"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        href={`/dashboard/donors/update/${donor.id}`}
                        className="bg-orange-200 border-orange-300 hover:bg-orange-600 hover:text-white transition-all border text-orange-600 px-3 py-2 rounded-md font-semibold flex items-center justify-center"
                        title="Update"
                      >
                        <FaEdit />
                      </Link>
                      <Link
                        href={`/dashboard/donors/delete/${donor.id}`}
                        className="bg-red-200 border-red-300 hover:bg-red-600 hover:text-white transition-all border text-red-600 px-3 py-2 rounded-md font-semibold flex items-center justify-center"
                        title="Delete"
                      >
                        <FaTrash />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
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
  );
};

export default DonorsPage;
