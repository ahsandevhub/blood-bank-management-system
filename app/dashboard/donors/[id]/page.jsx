"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DonorDetailsPage = ({ params }) => {
  const { id } = params; // Dynamic route parameter
  const router = useRouter();
  const [donor, setDonor] = useState(null);
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle null or undefined dates
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Converts to local date string
  };

  const calculateDaysLeft = (lastDonationDate, waitingPeriod = 120) => {
    if (!lastDonationDate) return "N/A";
    const lastDonation = new Date(lastDonationDate);
    const today = new Date();
    const nextEligibleDate = new Date(
      lastDonation.setDate(lastDonation.getDate() + waitingPeriod)
    );
    const daysLeft = Math.ceil(
      (nextEligibleDate - today) / (1000 * 60 * 60 * 24)
    ); // Convert milliseconds to days
    return daysLeft > 0 ? daysLeft : 0; // If negative, return 0
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const fetchDonorDetails = async () => {
      try {
        const response = await fetch(`/api/donors/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch donor details");
        }
        const data = await response.json();
        data.age = calculateAge(data.dob); // Calculate age from dob
        setDonor(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchDonorDetails();
  }, [id]);

  if (error) {
    return (
      <div className="p-6 text-red-600">
        <h1>Error</h1>
        <p>{error}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!donor) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-red-700">{donor.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Donor Details */}
        <div className="p-4 bg-white shadow rounded-lg space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Donor Details
          </h2>
          <p className="text-lg">
            <strong>Age:</strong> {donor.age}
          </p>
          <p className="text-lg">
            <strong>Gender:</strong> {donor.gender}
          </p>
          <p className="text-lg">
            <strong>Email:</strong> {donor.email}
          </p>
          <p className="text-lg">
            <strong>Phone:</strong> {donor.phone}
          </p>
          <p className="text-lg">
            <strong>City:</strong> {donor.city}
          </p>
          <p className="text-lg">
            <strong>Address:</strong> {donor.address}
          </p>
          <p className="text-lg">
            <strong>Blood Group:</strong> {donor.bloodType}
          </p>
          <p className="text-lg">
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${
                donor.status === "active" ? "text-green-600" : "text-red-600"
              }`}
            >
              {donor.status}
            </span>
          </p>
        </div>

        {/* Donation Statistics */}
        <div className="p-4 bg-white shadow rounded-lg space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Donation Statistics
          </h2>
          <p className="text-lg">
            <strong>Last Donation Date:</strong>{" "}
            {formatDate(donor.lastDonationDate) || "N/A"}
          </p>
          <p className="text-lg">
            <strong>Days Left to Become Active Donor:</strong>{" "}
            {calculateDaysLeft(donor.lastDonationDate, 90) || "N/A"} days
          </p>
        </div>
      </div>

      {/* Medical History Section */}
      <div className="p-4 bg-white shadow rounded-lg space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Medical History
        </h2>
        <p className="text-lg text-gray-700">
          {donor.medicalHistory || "No medical history provided."}
        </p>
      </div>

      <button
        onClick={() => router.back()}
        className="px-6 py-2 bg-red-600 text-white rounded-lg"
      >
        Go Back
      </button>
    </div>
  );
};

export default DonorDetailsPage;
