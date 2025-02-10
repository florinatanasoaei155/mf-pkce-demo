import { AuthProvider, useAuth } from "./AuthProvider";
import { useEffect, useState } from "react";
import { useOidcFetch } from "@axa-fr/react-oidc";

const ChildComponent = () => {
  return (
    <AuthProvider>
      <ChildApp />
    </AuthProvider>
  );
};

const ChildApp = () => {
  const { isAuthenticated, renewTokens } = useAuth();
  const { fetch } = useOidcFetch();
  const [reports, setReports] = useState<
    { id: number; name: string; date: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch Reports using OIDC Secured Fetch
  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/api/reports");

      if (response.status === 401) {
        console.warn("🔄 Token expired, attempting refresh...");
        await renewTokens();
        return fetchReports(); // Retry after refreshing token
      }

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      setReports(data);
    } catch (err: any) {
      console.error("❌ Error fetching reports:", err);
      setError("Failed to fetch reports.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Automatically fetch reports when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchReports();
    }
  }, [isAuthenticated]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 max-w-md mx-auto text-center">
      <h2 className="text-xl font-semibold mb-4 text-purple-600">
        Child Microfrontend
      </h2>
      {isAuthenticated && (
        <>
          <p className="text-green-600">✅ Authenticated in Child App</p>

          {/* Reports Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Generated Reports
            </h3>
            {loading ? (
              <p className="text-gray-500">Loading reports...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
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

          {/* Refresh Reports Button */}
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
            onClick={fetchReports}
          >
            Refresh Reports
          </button>
        </>
      )}
    </div>
  );
};

export default ChildComponent;
