"use client";

import { useState } from "react";

const BloodStockPage = () => {
  const [search, setSearch] = useState("");

  const bloodStock = [
    { id: 1, bloodGroup: "A+", quantity: 10 },
    { id: 2, bloodGroup: "A-", quantity: 5 },
    { id: 3, bloodGroup: "B+", quantity: 8 },
    { id: 4, bloodGroup: "B-", quantity: 3 },
    { id: 5, bloodGroup: "O+", quantity: 15 },
    { id: 6, bloodGroup: "O-", quantity: 2 },
    { id: 7, bloodGroup: "AB+", quantity: 6 },
    { id: 8, bloodGroup: "AB-", quantity: 1 },
  ];

  const filteredStock = bloodStock.filter((item) =>
    item.bloodGroup.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <header className="bg-white p-4 shadow rounded-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-700">Blood Stock</h1>
      </header>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Blood Group"
          className="p-2 border border-gray-300 rounded-lg w-1/3"
        />
      </div>

      {/* Blood Stock Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-red-700 text-white">
            <tr>
              <th className="p-4 border border-gray-200 text-left">
                Blood Group
              </th>
              <th className="p-4 border border-gray-200 text-left">
                Quantity (Units)
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.map((stock) => (
              <tr key={stock.id} className="hover:bg-gray-100">
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
