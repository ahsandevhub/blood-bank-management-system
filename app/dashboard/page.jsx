import Link from "next/link";

const DashboardPage = () => {
  const bloodStock = [
    { group: "A+", quantity: 25 },
    { group: "A-", quantity: 18 },
    { group: "B+", quantity: 20 },
    { group: "B-", quantity: 15 },
    { group: "AB+", quantity: 10 },
    { group: "AB-", quantity: 8 },
    { group: "O+", quantity: 30 },
    { group: "O-", quantity: 12 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Page Header */}
      <header className="bg-white p-4 shadow rounded-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-red-700">
          Blood Bank Dashboard
        </h1>
        <Link
          href={"/dashboard/add-donor"}
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700"
        >
          Add New Donor
        </Link>
      </header>

      {/* Dashboard Content */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Donor Statistics */}
        <div className="bg-white p-6 shadow rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Donor Statistics
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Registered Donors</span>
              <span className="font-bold text-red-600">1200</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Donors</span>
              <span className="font-bold text-green-600">850</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Inactive Donors</span>
              <span className="font-bold text-gray-400">350</span>
            </div>
          </div>
        </div>

        {/* Blood Stock */}
        <div className="bg-white p-6 shadow rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Blood Stock (Units)
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {bloodStock.map((stock) => (
              <div
                key={stock.group}
                className="flex justify-between p-3 border rounded-md"
              >
                <span className="font-medium text-gray-600">{stock.group}</span>
                <span className="font-bold text-gray-700">
                  {stock.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 shadow rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Activities
          </h2>
          <ul className="space-y-3">
            <li className="text-sm text-gray-600">
              <span className="font-bold text-gray-800">John Doe</span> donated
              blood (A+)
            </li>
            <li className="text-sm text-gray-600">
              <span className="font-bold text-gray-800">Request</span> for 3
              units of O+ blood.
            </li>
            <li className="text-sm text-gray-600">
              <span className="font-bold text-gray-800">Maria Smith</span>{" "}
              updated her donor profile.
            </li>
          </ul>
        </div>

        {/* Pending Requests */}
        <div className="col-span-1 lg:col-span-3 bg-white p-6 shadow rounded-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Pending Requests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-md">
              <p className="text-sm text-gray-600">
                <span className="font-bold">3 units</span> of B+ blood for{" "}
                <span className="font-bold">Jane Doe</span>
              </p>
              <button className="mt-2 px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700">
                Approve
              </button>
            </div>
            <div className="p-3 border rounded-md">
              <p className="text-sm text-gray-600">
                <span className="font-bold">2 units</span> of AB- blood for{" "}
                <span className="font-bold">City Hospital</span>
              </p>
              <button className="mt-2 px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700">
                Approve
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
