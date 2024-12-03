"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterUserPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
    bloodType: "",
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
      password: "",
      confirmPassword: "",
      gender: "",
      bloodType: "",
    });
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/register-user", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("User registered successfully!", {
        position: "top-center",
      });
      handleReset();

      setTimeout(() => {
        router.push("/user");
      }, 3000);
    } catch (error) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Something went wrong, please try again later.";

      toast.error(errorMessage, { position: "top-center" });
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto max-w-screen-sm">
        <header className="bg-white p-4 shadow rounded-md">
          <h1 className="text-2xl text-center font-bold text-blue-700">
            User Registration Form
          </h1>
        </header>

        <form
          className="bg-white p-6 shadow rounded-lg mt-6 grid grid-cols-1 gap-6"
          onSubmit={handleSubmit}
        >
          {/* Left Column */}
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
                placeholder="Enter your name"
              />
            </div>

            {/* Phone */}
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
                placeholder="Enter your phone number"
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
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

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

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded-lg"
                placeholder="Enter password"
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="p-2 border border-gray-300 rounded-lg"
                placeholder="Confirm password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`px-4 py-2 mx-auto w-52 font-semibold rounded-lg shadow 
              ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} 
              text-white flex items-center justify-center gap-2`}
              disabled={loading}
            >
              {loading && <FaSpinner className="animate-spin" />}{" "}
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default RegisterUserPage;
