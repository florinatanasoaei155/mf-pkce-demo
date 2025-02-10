import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
      <p>Welcome to the Parent App Dashboard</p>
      <Link to="/reports" className="text-blue-500 hover:underline">
        View Reports
      </Link>
    </div>
  );
};

export default Dashboard;
