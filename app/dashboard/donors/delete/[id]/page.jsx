"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

const DonorDetailsPage = ({ params }) => {
  const { id } = use(params); // Dynamic route parameter
  const router = useRouter();
  const [donor, setDonor] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this donor?"
    );
    if (!confirmDelete) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/donors/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete donor");
      }

      // Redirect to the donors list page or a relevant page
      router.push("/dashboard/donors");
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

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
      <header className="bg-white p-4 shadow rounded-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-700">{donor.name}</h1>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </header>

      {/* Donor Details Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Donor Details
          </h2>
          <table className="min-w-full border border-gray-200">
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2 font-semibold border-r bg-gray-50">
                  Age
                </td>
                <td className="px-4 py-2">{donor.age}</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-semibold border-r bg-gray-50">
                  Gender
                </td>
                <td className="px-4 py-2 capitalize">{donor.gender}</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-semibold border-r bg-gray-50">
                  Email
                </td>
                <td className="px-4 py-2">{donor.email}</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-semibold border-r bg-gray-50">
                  Phone
                </td>
                <td className="px-4 py-2">{donor.phone}</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-semibold border-r bg-gray-50">
                  City
                </td>
                <td className="px-4 py-2">{donor.city}</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-semibold border-r bg-gray-50">
                  Address
                </td>
                <td className="px-4 py-2">{donor.address}</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-semibold border-r bg-gray-50">
                  Blood Group
                </td>
                <td className="px-4 py-2">{donor.bloodType}</td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-semibold border-r bg-gray-50">
                  Status
                </td>
                <td
                  className={`px-4 py-2 capitalize font-semibold ${
                    donor.status === "active"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {donor.status}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Donation Statistics Section */}
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Donation Statistics
          </h2>
          <table className="min-w-full border border-gray-200">
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2 font-semibold w-1/2 border-r bg-gray-50">
                  Last Donation Date
                </td>
                <td className="px-4 py-2">
                  {formatDate(donor.lastDonationDate) || "N/A"}
                </td>
              </tr>
              <tr className="border-t">
                <td className="px-4 py-2 font-semibold border-r bg-gray-50">
                  Days Left to Become Active Donor
                </td>
                <td className="px-4 py-2">
                  {!donor.lastDonationDate
                    ? "Ready to donate"
                    : `${calculateDaysLeft(donor.lastDonationDate, 90)} days`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Medical History Section */}
      <div className="p-4 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Medical History
        </h2>
        <p className="text-lg text-gray-700">
          {donor.medicalHistory || "No medical history provided."}
        </p>
      </div>

      {/* Delete Button */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`px-6 py-2 w-max font-medium hover:bg-red-600 bg-red-500 text-white rounded-lg ${
            deleting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {deleting ? "Deleting..." : "Confirm Delete"}
        </button>
        <Link
          href={"/dashboard/donors"}
          className={`px-4 py-2 col-span-2 text-center w-52 bg-blue-500 text-white hover:bg-blue-600 font-semibold rounded-lg shadow`}
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default DonorDetailsPage;
