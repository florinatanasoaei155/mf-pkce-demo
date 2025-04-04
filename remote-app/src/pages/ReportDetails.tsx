import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Report } from "../types";
import reports from "../mocks/reports.json";

const ReportDetails = () => {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    const foundReport = reports.find((item) => item.id === id);
    if (id && foundReport) {
      setReport(foundReport);
    }
  }, [id]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        📄 Report Details
      </h2>

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
