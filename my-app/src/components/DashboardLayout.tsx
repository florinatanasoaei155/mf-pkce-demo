import { Outlet, Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const DashboardLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
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
        <button
          className="mt-auto bg-red-500 p-2 rounded"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
