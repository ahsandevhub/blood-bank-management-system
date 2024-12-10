"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

const NewRequestPage = () => {
  const router = useRouter();
  const [bloodGroup, setBloodGroup] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bloodGroup || !quantity || isNaN(quantity) || quantity <= 0) {
      setError("Please select a blood group and enter a valid quantity.");
      return;
    }
    setError("");

    // Ensure user data is available
    if (!userData) {
      setError("User data is missing. Please try again.");
      setLoading(false);
      return;
    }

    // Send request to the backend API with the user's ID
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userData.id, bloodGroup, quantity }),
      });

      if (!response.ok) throw new Error("Failed to create request");

      // Clear form after successful submission
      setBloodGroup("");
      setQuantity("");
      alert("Blood request successfully created.");

      router.push("/user/dashboard/requests");
    } catch (err) {
      console.error("Error submitting request:", err);
      setError("Failed to create request.");
    }
  };

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
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="bg-white p-4 shadow rounded-md mb-6">
        <h1 className="text-2xl font-bold text-blue-700">
          Make a New Blood Request
        </h1>
      </header>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 border border-blue-300 rounded-md">
          {error}
        </div>
      )}

      {/* Form for new request */}
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-md">
        <div className="mb-4">
          <label
            htmlFor="bloodGroup"
            className="block text-lg font-medium text-gray-700"
          >
            Blood Group
          </label>
          <select
            id="bloodGroup"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            required
          >
            <option value="">Select a Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="quantity"
            className="block text-lg font-medium text-gray-700"
          >
            Quantity (Units)
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-2 p-2 border border-gray-300 rounded-md w-full"
            required
            placeholder="Enter quantity"
            min="1"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-700 text-white font-semibold rounded-md shadow hover:bg-blue-800 transition disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
};

export default NewRequestPage;
