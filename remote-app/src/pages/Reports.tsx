import { useEffect, useState } from "react";
import { useOidcFetch } from "@axa-fr/react-oidc";
import { Report } from "../types";

const ChildComponent = () => {
  const { fetch } = useOidcFetch();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:9000/api/reports");

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

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mt-6 max-w-md mx-auto text-center">
      <h2 className="text-xl font-semibold mb-4 text-purple-600">
        Child Microfrontend
      </h2>
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

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg mt-4"
        onClick={fetchReports}
      >
        Refresh Reports
      </button>
    </div>
  );
};

export default ChildComponent;
