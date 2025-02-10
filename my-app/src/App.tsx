import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import ChildComponent from "remote_app/ChildComponent";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<h1>Dashboard Content</h1>} />
            <Route path="/reports/*" element={<ChildComponent />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
