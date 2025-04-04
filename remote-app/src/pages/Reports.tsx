import { Link } from "react-router-dom";
import reports from "../mocks/reports.json";

const Reports = () => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Reports</h2>

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
