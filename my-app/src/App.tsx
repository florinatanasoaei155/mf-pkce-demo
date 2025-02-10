import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import { lazy, Suspense } from "react";

const ChildComponent = lazy(() => import("remote_app/ChildComponent"));

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ParentComponent />
      </Router>
    </AuthProvider>
  );
};

const ParentComponent = () => {
  const { login, logout, isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Parent App</h1>

        <nav className="mb-4">
          <Link className="mr-4 text-blue-500 hover:underline" to="/reports">
            Reports
          </Link>
        </nav>

        {isAuthenticated ? (
          <>
            <p className="text-green-600 mb-4">✅ Logged in</p>
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg mb-4"
              onClick={() => logout()}
            >
              Logout
            </button>

            <Routes>
              {/* Parent App only handles /reports, Child App takes over after */}
              <Route
                path="/reports/*"
                element={
                  <Suspense fallback={<p>Loading Reports...</p>}>
                    <ChildComponent />
                  </Suspense>
                }
              />
            </Routes>
          </>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            onClick={() => login()}
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
