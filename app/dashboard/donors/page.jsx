"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedbloodType, setSelectedbloodType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Fetch donors data from the API on component mount
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const response = await fetch("/api/donors"); // Adjust the API URL as needed
        const data = await response.json();
        setDonors(data);
      } catch (error) {
        console.error("Error fetching donors:", error);
      }
    };

    fetchDonors();
  }, []); // Empty dependency array to fetch data only once when the component mounts

  // Filter donors based on search query, blood group, and status
  const filteredDonors = donors.filter(
    (donor) =>
      (donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donor.bloodType.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedbloodType ? donor.bloodType === selectedbloodType : true) &&
      (selectedStatus ? donor.status === selectedStatus : true)
  );

  // Function to handle the view details action
  const handleViewDetails = (donor) => {
    console.log("Donor Details:", donor); // You can replace this with a modal or page navigation
  };

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <header className="bg-white p-4 shadow rounded-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-700">Donors List</h1>
        <Link
          href={"/dashboard/add-donor"}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700"
        >
          Add New Donor
        </Link>
      </header>

      {/* Search and Filters */}
      <div className="flex items-center mb-4 space-x-4">
        <select
          className="p-2 border border-gray-300 rounded-lg"
          value={selectedbloodType}
          onChange={(e) => setSelectedbloodType(e.target.value)}
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
        />
      </div>

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
              <th className="p-4 border border-gray-200 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.map((donor) => (
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
                  <Link
                    href={`/dashboard/donors/${donor.id}`}
                    onClick={() => handleViewDetails(donor)}
                    className="px-4 text-sm py-1 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonorsPage;
