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
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-md shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
        <div className="mt-6">
          <p className="text-lg font-semibold text-gray-600">Name:</p>
          <p className="text-xl">{userData?.fullName || "N/A"}</p>
        </div>
        <div className="mt-4">
          <p className="text-lg font-semibold text-gray-600">Phone:</p>
          <p className="text-xl">{userData?.phone || "N/A"}</p>
        </div>
        <div className="mt-4">
          <p className="text-lg font-semibold text-gray-600">Gender:</p>
          <p className="text-xl">{userData?.sex || "N/A"}</p>
        </div>
        <div className="mt-4">
          <p className="text-lg font-semibold text-gray-600">Blood Group:</p>
          <p className="text-xl">{userData?.bloodGroup || "N/A"}</p>
        </div>
        <div className="mt-8">
          <a
            href="/user/dashboard"
            className="inline-block bg-blue-700 text-white px-6 py-2 rounded-md text-center font-semibold hover:bg-blue-600"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
