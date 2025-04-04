import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import DashboardLayout from "./components/DashboardLayout";
import ChildComponent from "remote_app/ChildComponent";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          element={
            <Suspense fallback={<p>Error</p>}>
              <DashboardLayout />
            </Suspense>
          }
        >
          <Route path="/dashboard" element={<h1>Dashboard Content</h1>} />
          <Route path="/reports/*" element={<ChildComponent />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
