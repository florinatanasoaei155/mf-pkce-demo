import { useOidcFetch } from "@axa-fr/react-oidc";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Report } from "../types";

const ReportsPage = () => {
  const { fetch } = useOidcFetch();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:9000/api/reports");
      if (!response.ok) throw new Error("Failed to fetch reports");

      const data = await response.json();
      setReports(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Reports</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul>
          {reports.map((report) => (
            <li key={report.id} className="mb-2">
              <Link
                to={`/${report.id}`}
                className="text-blue-500 hover:underline"
              >
                {report.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportsPage;
