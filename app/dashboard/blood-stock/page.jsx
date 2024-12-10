"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const BloodStockPage = () => {
  const [search, setSearch] = useState("");
  const [bloodStock, setBloodStock] = useState([]);
  const [loadingStock, setLoadingStock] = useState(true);
  const [error, setError] = useState("");

  // Fetch blood stock data from the API
  useEffect(() => {
    const fetchBloodStock = async () => {
      try {
        setLoadingStock(true);
        const response = await fetch("/api/blood-stock-in");
        if (!response.ok) throw new Error("Failed to fetch blood stock");
        const data = await response.json();
        setBloodStock(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching blood stock:", error);
        setError("Failed to load blood stock data");
      } finally {
        setLoadingStock(false);
      }
    };
    fetchBloodStock();
  }, []);

  if (loadingStock) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Filter blood stock based on search input
  const filteredStock = bloodStock.filter((item) =>
    item.bloodGroup.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <header className="bg-white p-4 shadow rounded-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-700">Blood Stock</h1>
        <Link
          href={"/dashboard/blood-stock/add-stock"}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700"
        >
          Add Blood Stock
        </Link>
      </header>

      {/* Blood Stock Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse text-center border border-gray-200">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="p-4 border border-gray-200">Stock Id</th>
              <th className="p-4 border border-gray-200">Date and time</th>
              <th className="p-4 border border-gray-200">Blood Group</th>
              <th className="p-4 border border-gray-200">Quantity (Units)</th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.map((stock, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="p-4 border border-gray-200">{stock.id}</td>
                <td className="p-4 border border-gray-200">
                  {new Date(stock.last_updated).toLocaleString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true, // Use 12-hour format
                  })}
                </td>
                <td className="p-4 border border-gray-200">
                  {stock.bloodGroup}
                </td>
                <td className="p-4 border border-gray-200">{stock.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BloodStockPage;
