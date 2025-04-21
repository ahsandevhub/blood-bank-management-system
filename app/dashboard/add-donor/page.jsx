"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddDonorPage = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
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
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(""); // Clear any previous message

    try {
      // Send POST request using axios
      const response = await axios.post("/api/donors", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Handle success
      alert(`Donor added successfully with ID: ${response.data.id}`);
      handleReset();
    } catch (error) {
      console.error("Error adding donor:", error);

      // Determine the error message
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Something went wrong, please try again later.";

      // Show the error toast
      toast.error(errorMessage, {
        position: "top-center",
      });

      // Update the state message (optional, if you need it elsewhere)
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="bg-white p-4 shadow flex items-center justify-between rounded-md">
        <h1 className="text-2xl font-bold text-red-700">Add New Donor</h1>
        <Link
          href={"/dashboard/blood-stock"}
          className={`px-6 py-2 col-span-2 text-center bg-red-500 text-white hover:bg-red-600 font-semibold rounded-lg shadow`}
          disabled={loading}
        >
          Cancel
        </Link>
      </header>

      {/* Donor Form */}
      <form
        className="bg-white p-6 shadow rounded-lg mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        {/* Left Column - Personal Information */}
        <div className="space-y-4">
          {/* Name */}
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

          {/* Contact Details */}
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
              type="text"
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

        {/* Right Column - Medical Information */}
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
              value={formData.medicalHistory}
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
              checked={!formData.lastDonationDate}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  lastDonationDate: e.target.checked ? "" : null,
                }));
              }}
            />
            <label className="text-sm font-semibold text-gray-700">
              I have never donated blood before
            </label>
          </div>

          {/* Error message */}
          {message && <p className="text-red-500">* {message}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className={`px-4 py-2 mx-auto w-52 font-semibold rounded-lg shadow 
      ${loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"} 
      text-white flex items-center justify-center gap-2`}
            disabled={loading} // Disable button while loading
          >
            {loading && <FaSpinner className="animate-spin" />}{" "}
            {/* Spinner icon */}
            {loading ? "Adding..." : "Add Donor"} {/* Conditional text */}
          </button>
        </div>
      </form>

      {/* Toastify Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default AddDonorPage;
