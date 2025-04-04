import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Report } from "../types";

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`http://localhost:9000/api/reports/${id}`);
        if (!response.ok) throw new Error("Failed to fetch report");

        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        📄 Report Details
      </h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {report && (
        <>
          <p className="text-lg font-semibold">{report.name}</p>
          <p className="text-gray-600">📅 Date: {report.date}</p>

          <div className="mt-4">
            <Link
              to={`/${report.id}/edit`}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              ✏️ Edit Report
            </Link>
          </div>
        </>
      )}

      <Link to="/" className="text-blue-500 mt-4 inline-block">
        ⬅ Back to Reports
      </Link>
    </div>
  );
};

export default ReportDetails;
