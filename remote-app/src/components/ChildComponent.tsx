import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
} from "react-router-dom";
import ReportsPage from "../pages/Reports";
import ReportDetail from "../pages/ReportDetails";
import EditReport from "../pages/EditReport";
import { AuthProvider } from "./AuthProvider";

const Breadcrumb = () => {
  const { id } = useParams();

  return (
    <nav className="text-gray-500 mb-4">
      <Link to="/">📊 Reports</Link>
      {id && (
        <span>
          {" "}
          / <Link to={`/${id}`}>Report {id}</Link>
        </span>
      )}
    </nav>
  );
};

const ChildComponent = () => {
  return (
    <AuthProvider>
      <Router basename="/reports">
        <div className="p-5">
          <Breadcrumb />
          <Routes>
            <Route path="/" element={<ReportsPage />} />
            <Route path="/:id" element={<ReportDetail />} />
            <Route path="/:id/edit" element={<EditReport />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default ChildComponent;
