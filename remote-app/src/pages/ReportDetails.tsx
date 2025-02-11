import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useOidcFetch } from "@axa-fr/react-oidc";
import { Report } from "../types";

const ReportDetail = () => {
  const { id } = useParams();
  const { fetch } = useOidcFetch();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:9000/api/reports/${id}`);
        if (!response.ok) throw new Error("Report not found");

        const data = await response.json();
        setReport(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : report ? (
        <>
          <h3 className="text-lg font-semibold">{report.name}</h3>
          <p>📅 {report.date}</p>
          <Link to={`/${id}/edit`} className="text-blue-500 hover:underline">
            Edit Report
          </Link>
        </>
      ) : (
        <p>Report is null</p>
      )}
    </div>
  );
};

export default ReportDetail;
