import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import Reports from "../pages/Reports";
import ReportDetail from "../pages/ReportDetails";
import EditReport from "../pages/EditReport";

const ChildComponent = () => {
  return (
    <AuthProvider>
      <Router basename="/reports">
        <Routes>
          <Route path="/" element={<Reports />} />
          <Route path="/:id" element={<ReportDetail />} />
          <Route path="/:id/edit" element={<EditReport />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default ChildComponent;
