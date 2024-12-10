"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBloodStock = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    bloodGroup: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      bloodGroup: "",
      quantity: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/blood-stock-in", formData); // Send POST request with Axios
      console.log(response.data);
      toast.success("Blood stock added successfully!", {
        position: "top-center",
      });

      setTimeout(() => {
        router.push("/dashboard/blood-stock");
      }, 1500);

      handleReset();
    } catch (error) {
      console.error("Error adding blood stock:", error);
      toast.error("Something went wrong, please try again later.", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <header className="bg-white p-4 shadow flex items-center justify-between rounded-md">
        <h1 className="text-2xl font-bold text-red-700">Add Blood Stock</h1>
        <Link
          href={"/dashboard/blood-stock"}
          className={`px-6 py-2 col-span-2 text-center bg-red-500 text-white hover:bg-red-600 font-semibold rounded-lg shadow`}
          disabled={loading}
        >
          Cancel
        </Link>
      </header>

      {/* Blood Stock Form */}
      <form
        className="bg-white p-6 shadow rounded-lg mt-6 w-full"
        onSubmit={handleSubmit}
      >
        {/* Blood Group */}
        <div className="mb-4 space-y-1">
          <label className="text-lg font-semibold text-gray-700">
            Blood Group <span className="text-red-600">*</span>
          </label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
            className="p-2 border border-gray-300 rounded-lg w-full"
          >
            <option value="">Select Blood Group</option>
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

        {/* Quantity */}
        <div className="mb-4 space-y-1">
          <label className="text-lg font-semibold text-gray-700">
            Quantity <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            step="0.1"
            className="p-2 border border-gray-300 rounded-lg w-full"
            placeholder="Enter quantity"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`px-4 py-2 mx-auto w-full font-semibold rounded-lg shadow ${
            loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
          } text-white flex items-center justify-center gap-2`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Blood Stock"}
        </button>
      </form>

      {/* Toastify Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default AddBloodStock;
