import { Outlet, Link } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-blue-600 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-2">
          <Link to="/dashboard" className="block p-2 rounded hover:bg-blue-500">
            🏠 Dashboard
          </Link>
          <Link to="/reports" className="block p-2 rounded hover:bg-blue-500">
            📊 Reports
          </Link>
        </nav>
      </div>

      <div className="flex-1 p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
