"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const UserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
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
        console.error("Error fetching user profile:", err.message);
        setError("Failed to fetch user profile. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserProfile();
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
      <div className="min-h-screen flex items-center justify-center text-red-700">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="bg-white p-4 shadow rounded-md mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Profile Details</h1>
      </header>
      <div className="mx-auto bg-white p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h1>
        <div className="overflow-hidden">
          <table className="min-w-full bg-white border-collapse">
            <tbody>
              <tr className="border-b">
                <th className="px-4 py-3 w-[300px] text-left border text-gray-600 font-semibold">
                  Name
                </th>
                <td className="px-4 py-3 border text-gray-800">
                  {userData?.name || "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-3 w-[300px] text-left border text-gray-600 font-semibold">
                  Phone
                </th>
                <td className="px-4 py-3 border text-gray-800">
                  {userData?.phone || "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-3 w-[300px] text-left border text-gray-600 font-semibold">
                  Gender
                </th>
                <td className="px-4 py-3 border text-gray-800">
                  {userData?.gender || "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-3 w-[300px] text-left border text-gray-600 font-semibold">
                  Blood Group
                </th>
                <td className="px-4 py-3 border text-gray-800">
                  {userData?.bloodType || "N/A"}
                </td>
              </tr>
              <tr className="border-b">
                <th className="px-4 py-3 w-[300px] text-left border text-gray-600 font-semibold">
                  Account created at
                </th>
                <td className="px-4 py-3 border text-gray-800">
                  {new Date(userData?.createdAt).toLocaleDateString() || "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <a
            href="/user/dashboard"
            className="inline-block bg-blue-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
