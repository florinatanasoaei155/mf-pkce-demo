import { Link, useParams } from "react-router-dom";

const EditReport = () => {
  const { id } = useParams();

  return (
    <div className="p-5">
      <h3 className="text-lg font-semibold">Editing Report #{id}</h3>
      <p>Edit form for report {id}...</p>
      <Link to={`/${id}`} className="text-blue-500 hover:underline">
        Back to Report
      </Link>
    </div>
  );
};

export default EditReport;
