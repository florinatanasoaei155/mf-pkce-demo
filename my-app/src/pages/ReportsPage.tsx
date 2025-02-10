import { Link } from "react-router-dom";

const ReportsPage = () => {
  const reports = [
    { id: 1, name: "Monthly Sales Report" },
    { id: 2, name: "User Engagement Analysis" },
    { id: 3, name: "Revenue Forecast" },
  ];

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Reports</h2>
      <ul>
        {reports.map((report) => (
          <li key={report.id} className="mb-2">
            <Link
              to={`/report/${report.id}`}
              className="text-blue-500 hover:underline"
            >
              {report.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportsPage;
