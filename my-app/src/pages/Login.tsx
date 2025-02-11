import { useState, useEffect } from "react";
import { useOidc } from "@axa-fr/react-oidc";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { login, isAuthenticated } = useOidc();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:9000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          redirect_uri: "http://localhost:5173/authentication/callback",
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      login("/dashboard", { code: data.authorization_code });
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Login</h2>
        <p className="text-gray-500 mb-6">Sign in with your credentials.</p>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <button
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
