"use client";

import axios from "axios";
import Link from "next/link";
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
    <div
      className="min-h-screen relative bg-gray-100 flex items-center justify-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('../images/bg2.png')" }}
    >
      <div className="absolute top-0 right-0 z-50 m-5">
        <Link
          href="/"
          className="bg-red-600 text-white rounded-md px-4 py-2 hover:bg-red-700 transition duration-200"
        >
          Admin Login
        </Link>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-50"></div>
      <div className="relative z-10 bg-white/90 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-3">
          Blood Bank Management System
        </h2>
        <h3 className="mb-5 text-lg font-bold flex justify-center">
          <span className="bg-blue-600 text-white py-2 px-5 rounded-lg">
            User Registration
          </span>
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Type <span className="text-red-500">*</span>
            </label>
            <select
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Blood Type</option>
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

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create password"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm password"
            />
          </div>

          <button
            type="submit"
            className={`w-full ${
              loading
                ? "bg-blue-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-semibold py-2 rounded-lg transition duration-200 flex items-center justify-center`}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center mt-5">
          Already have an account?{" "}
          <Link className="text-red-500 hover:underline" href="/user">
            Login
          </Link>
        </p>

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
};

export default RegisterUserPage;
