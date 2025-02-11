import { useEffect } from "react";
import { useOidc } from "@axa-fr/react-oidc";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, isAuthenticated } = useOidc();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Login</h2>
        <p className="text-gray-500 mb-6">
          Please login using OpenID Connect authentication.
        </p>
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
          onClick={() => login()}
        >
          Login with OIDC
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
