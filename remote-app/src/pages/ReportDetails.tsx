import { Link, useParams } from "react-router-dom";

const ReportDetails = () => {
  const { id } = useParams();

  return (
    <div className="p-5">
      <h3 className="text-lg font-semibold">Report #{id}</h3>
      <p>Details for report {id}...</p>
      <Link to={`/${id}/edit`} className="text-blue-500 hover:underline">
        Edit Report
      </Link>
    </div>
  );
};

export default ReportDetails;
