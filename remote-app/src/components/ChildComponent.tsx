import { AuthProvider, useAuth } from "./AuthProvider";
import { useEffect, useState } from "react";

const ChildComponent = () => {
  return (
    <AuthProvider>
      <ChildApp />
    </AuthProvider>
  );
};

const ChildApp = () => {
  const { login, logout, isAuthenticated } = useAuth();
  const [reports, setReports] = useState<
    { id: number; name: string; date: string }[]
  >([]);

  // Simulate fetching reports from an API
  useEffect(() => {
    if (isAuthenticated) {
      setTimeout(() => {
        setReports([
          { id: 1, name: "Monthly Sales Report", date: "2024-02-06" },
          { id: 2, name: "User Engagement Analysis", date: "2024-02-05" },
          { id: 3, name: "Revenue Forecast", date: "2024-02-04" },
        ]);
      }, 1000);
    }
  }, [isAuthenticated]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 max-w-md mx-auto text-center">
      <h2 className="text-xl font-semibold mb-4 text-purple-600">
        Child Microfrontend
      </h2>

      {isAuthenticated ? (
        <>
          <p className="text-green-600">✅ Authenticated in Child App</p>
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg mt-4"
            onClick={() => logout()}
          >
            Logout
          </button>

          {/* Mock Report List */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Generated Reports
            </h3>
            {reports.length === 0 ? (
              <p className="text-gray-500">Loading reports...</p>
            ) : (
              <ul className="space-y-2">
                {reports.map((report) => (
                  <li
                    key={report.id}
                    className="bg-gray-100 p-3 rounded-lg text-gray-800 shadow-sm"
                  >
                    📄 {report.name}{" "}
                    <span className="text-gray-500">({report.date})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          onClick={() => login()}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default ChildComponent;
