import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOidcFetch } from "@axa-fr/react-oidc";
import { Report } from "../types";

const Reports = () => {
  const { fetch } = useOidcFetch();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:9000/api/reports");
        if (!response.ok) throw new Error("Failed to fetch reports");

        const data = await response.json();
        setReports(data);
      } catch (err) {
        setError("Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Reports</h2>

      {loading && <p className="text-gray-500">Loading reports...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul className="space-y-4">
        {reports.map((report) => (
          <li
            key={report.id}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md"
          >
            <div>
              <Link
                to={`/${report.id}`}
                className="text-blue-600 font-semibold hover:underline"
              >
                {report.name}
              </Link>
              <p className="text-gray-500">📅 {report.date}</p>
            </div>
            <Link
              to={`/${report.id}/edit`}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              ✏️ Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reports;
