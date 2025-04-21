"use client";

import { useEffect, useState } from "react";

const RegisteredUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Fetch users data from the API on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users"); // Adjust the API URL as needed
        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query and status
  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedStatus ? user.status === selectedStatus : true)
  );

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <header className="bg-white p-4 shadow rounded-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-700">Registered Users</h1>
        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow">
              Search
            </div>
            <input
              type="text"
              placeholder="Search by name or email"
              className="p-2 border border-gray-300 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search users"
            />
          </div>
        </div>
      </header>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="p-4 border border-gray-200 text-center w-[200px]">
                User ID
              </th>
              <th className="p-4 border border-gray-200 text-left">Name</th>
              <th className="p-4 border border-gray-200 text-left">Phone</th>
              <th className="p-4 border border-gray-200 text-left">Sex</th>
              <th className="p-4 border border-gray-200 text-left">
                Blood Group
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td className="p-4 border border-gray-200 text-center">
                    {index + 1}
                  </td>
                  <td className="p-4 border border-gray-200">{user.name}</td>
                  <td className="p-4 border border-gray-200">{user.phone}</td>
                  <td className="p-4 border border-gray-200">{user.gender}</td>
                  <td className="p-4 border border-gray-200">
                    {user.bloodType}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="p-4 text-center text-gray-500 border border-gray-200"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisteredUsersPage;
