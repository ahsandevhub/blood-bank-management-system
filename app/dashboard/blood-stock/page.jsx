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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        {/* Heartbeat Monitor */}
        <div className="relative w-full max-w-xl h-24">
          {/* Line */}
          <div className="absolute top-1/2 w-full border-t-2 border-red-300"></div>

          {/* Heartbeat SVG Line */}
          <svg
            className="w-full h-full animate-heartbeat"
            viewBox="0 0 500 100"
            preserveAspectRatio="none"
          >
            <polyline
              fill="none"
              stroke="#dc2626"
              strokeWidth="3"
              points="0,50 50,50 70,20 90,80 110,50 200,50 220,30 240,70 260,50 500,50"
            />
          </svg>

          {/* Blood Drop at Pulse */}
          <div className="absolute left-[90px] top-[30px] animate-drop">
            <div
              className="w-4 h-6 bg-red-600 rounded-full transform rotate-180 drop-shadow-lg"
              style={{
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
              }}
            ></div>
          </div>
        </div>

        {/* Loading Text */}
        <p className="mt-10 text-xl text-red-600 font-bold tracking-wide animate-pulse">
          Checking vital signs...
        </p>

        {/* Custom animations */}
        <style jsx>{`
          @keyframes heartbeat {
            0% {
              stroke-dashoffset: 1000;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }

          @keyframes drop {
            0%,
            70% {
              opacity: 0;
              transform: translateY(0) scale(1) rotate(180deg);
            }
            80% {
              opacity: 1;
              transform: translateY(0) scale(1.2) rotate(180deg);
            }
            100% {
              opacity: 0;
              transform: translateY(20px) scale(0.8) rotate(180deg);
            }
          }

          .animate-heartbeat polyline {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: heartbeat 2s linear infinite;
          }

          .animate-drop {
            animation: drop 2s infinite ease-in-out;
          }
        `}</style>
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
                <td className="p-4 border border-gray-200">{index + 1}</td>
                <td className="p-4 border border-gray-200">
                  {new Date(stock.updatedAt).toLocaleString("en-US", {
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
