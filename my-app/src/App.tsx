import { AuthProvider, useAuth } from "./components/AuthProvider";
import { lazy, Suspense } from "react";
const ChildComponent = lazy(() => import("remote_app/ChildComponent"));

const App = () => {
  return (
    <AuthProvider>
      <ParentComponent />
    </AuthProvider>
  );
};

const ParentComponent = () => {
  const { login, logout, isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Parent App</h1>

        {isAuthenticated ? (
          <>
            <p className="text-green-600 mb-4">✅ Logged in</p>
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg mb-4"
              onClick={() => logout()}
            >
              Logout
            </button>
            <Suspense
              fallback={<p className="text-gray-500">Loading Child...</p>}
            >
              <ChildComponent />
            </Suspense>
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
