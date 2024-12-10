"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateDonorPage = ({ params }) => {
  const router = useRouter();
  const { id } = use(params);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    gender: "",
    dob: "",
    bloodType: "",
    medicalHistory: "",
    lastDonationDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch existing donor data
  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/donors/${id}`);

        // Extract data and format date fields
        const data = response.data;

        // Ensure date fields are formatted as YYYY-MM-DD
        const formattedData = {
          ...data,
          dob: data.dob ? formatDate(data.dob) : "", // Format date of birth
          lastDonationDate: data.lastDonationDate
            ? formatDate(data.lastDonationDate)
            : "", // Format last donation date
        };

        setFormData(formattedData); // Populate form with donor data
      } catch (error) {
        console.error("Error fetching donor data:", error);
        toast.error("Failed to load donor data. Please try again.", {
          position: "top-center",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDonorData();
  }, [id]);

  // Helper function to format dates to YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0]; // Extract the date in YYYY-MM-DD format
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous message

    try {
      // Use the correct id here for the PUT request
      await axios.put(`/api/donors/${id}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Donor updated successfully!", {
        position: "bottom-center",
      });

      setTimeout(() => {
        router.push("/dashboard/donors");
      }, 1500);
    } catch (error) {
      console.error("Error updating donor:", error);

      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Something went wrong, please try again later.";

      toast.error(errorMessage, {
        position: "top-center",
      });

      setMessage(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="bg-white p-4 shadow rounded-md">
        <h1 className="text-2xl font-bold text-red-700">
          Update Donor Details
        </h1>
      </header>

      {/* Donor Form */}
      <form
        className="bg-white p-6 shadow rounded-lg mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        {/* Left Column - Personal Information */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-lg"
              placeholder="Enter full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Phone <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded-lg"
                placeholder="Enter phone number"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded-lg"
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              City <span className="text-red-600">*</span>
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select City</option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Khulna">Khulna</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Barisal">Barisal</option>
              <option value="Rangpur">Rangpur</option>
              <option value="Mymensingh">Mymensingh</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Address <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-lg"
              placeholder="Enter full address"
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Gender <span className="text-red-600">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Date of Birth <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Blood Type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Blood Type <span className="text-red-600">*</span>
            </label>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              required
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select blood type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          {/* Medical History */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Medical History
            </label>
            <textarea
              name="medicalHistory"
              value={formData.description || ""}
              onChange={handleChange}
              className="p-2 border h-32 border-gray-300 rounded-lg"
              placeholder="Any medical history (e.g., allergies, surgeries, etc.)"
            />
          </div>

          {/* Last Blood Donation Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Last Blood Donation Date
            </label>
            <input
              type="date"
              name="lastDonationDate"
              value={formData.lastDonationDate}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Checkbox for Not Donated Before */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="hasDonatedBefore"
              id="check"
              checked={!formData.lastDonationDate}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  lastDonationDate: e.target.checked ? "" : null,
                }));
              }}
              className="size-4"
            />
            <label htmlFor="check" className="font-semibold text-gray-700">
              Mark as active donor
            </label>
          </div>
        </div>
        <div className="col-span-2 gap-6 flex justify-center">
          <Link
            href={"/dashboard/donors"}
            className={`px-4 py-2 col-span-2 text-center w-52 bg-blue-500 text-white hover:bg-blue-600 font-semibold rounded-lg shadow`}
            disabled={loading}
          >
            Cancel
          </Link>
          <button
            type="submit"
            className={`px-4 py-2 w-52 font-semibold rounded-lg shadow 
      ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"} 
      text-white flex items-center justify-center gap-2`}
            disabled={loading}
          >
            {loading && <FaSpinner className="animate-spin" />}
            {loading ? "Updating..." : "Update Donor"}
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default UpdateDonorPage;
