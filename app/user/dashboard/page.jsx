const UserDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <header className="bg-blue-700 text-white p-6 rounded-md shadow-md">
        <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
        <p className="mt-2 text-sm">
          Manage your blood donation activities effortlessly.
        </p>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-4 rounded-md shadow-md text-center">
          <h2 className="text-lg font-bold text-blue-700">Total Donations</h2>
          <p className="text-2xl font-semibold mt-2">5</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md text-center">
          <h2 className="text-lg font-bold text-blue-700">Pending Requests</h2>
          <p className="text-2xl font-semibold mt-2">2</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md text-center">
          <h2 className="text-lg font-bold text-blue-700">Blood Group</h2>
          <p className="text-2xl font-semibold mt-2">O+</p>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="mt-8">
        <h2 className="text-xl font-bold text-gray-700">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <a
            href="/user-dashboard/my-requests"
            className="block bg-blue-700 text-white p-4 rounded-md text-center font-semibold hover:bg-blue-600"
          >
            My Requests
          </a>
          <a
            href="/user-dashboard/donation-history"
            className="block bg-blue-700 text-white p-4 rounded-md text-center font-semibold hover:bg-blue-600"
          >
            Donation History
          </a>
          <a
            href="/user-dashboard/profile"
            className="block bg-blue-700 text-white p-4 rounded-md text-center font-semibold hover:bg-blue-600"
          >
            Profile
          </a>
          <a
            href="/user-dashboard/request-blood"
            className="block bg-blue-700 text-white p-4 rounded-md text-center font-semibold hover:bg-blue-600"
          >
            Request Blood
          </a>
        </div>
      </section>
    </div>
  );
};

export default UserDashboardPage;
