const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = {
  "test-user": {
    sub: "1234567890",
    name: "Test User",
    email: "testuser@example.com",
  },
};

let authCodes = {};
let tokens = {};

// Step 1: OIDC Discovery Endpoint
app.get("/.well-known/openid-configuration", (_, res) => {
  res.json({
    issuer: "http://localhost:9000",
    authorization_endpoint: "http://localhost:9000/connect/authorize",
    token_endpoint: "http://localhost:9000/connect/token",
    userinfo_endpoint: "http://localhost:9000/connect/userinfo",
    jwks_uri: "http://localhost:9000/.well-known/jwks",
    grant_types_supported: ["authorization_code", "refresh_token"],
    response_types_supported: ["code"],
    scopes_supported: ["openid", "profile", "email"],
    code_challenge_methods_supported: ["S256"],
  });
});

// 📌 Authorization Endpoint
app.get("/connect/authorize", (req, res) => {
  const {
    client_id,
    redirect_uri,
    response_type,
    state,
    code_challenge,
    code_challenge_method,
  } = req.query;

  if (
    !client_id ||
    !redirect_uri ||
    !response_type ||
    !state ||
    !code_challenge ||
    !code_challenge_method
  ) {
    return res.status(400).json({ error: "invalid_request" });
  }

  const authCode = crypto.randomBytes(16).toString("hex");
  authCodes[authCode] = { code_challenge, redirect_uri };

  console.log(`✅ Issued Auth Code: ${authCode}`);

  res.redirect(`${redirect_uri}?code=${authCode}&state=${state}`);
});

// 📌 Token Exchange Endpoint
app.post("/connect/token", (req, res) => {
  console.log("🔹 Token request received with body:", req.body); // Log request payload

  const { code, client_id, redirect_uri, grant_type, code_verifier } = req.body;

  if (!grant_type || !code) {
    console.error("❌ Missing grant_type or code!");
    return res.status(400).json({
      error: "invalid_request",
      error_description: "Missing grant_type or code",
    });
  }

  if (grant_type !== "authorization_code") {
    console.error("❌ Invalid grant type:", grant_type);
    return res.status(400).json({
      error: "unsupported_grant_type",
      error_description: "Only authorization_code is supported",
    });
  }

  const savedCode = authCodes[code];
  if (!savedCode || savedCode.redirect_uri !== redirect_uri) {
    console.error("❌ Invalid or expired authorization code");
    return res.status(400).json({
      error: "invalid_grant",
      error_description: "Invalid or expired authorization code",
    });
  }

  if (!code_verifier) {
    console.error("❌ Missing code_verifier");
    return res.status(400).json({
      error: "invalid_request",
      error_description: "Missing code_verifier",
    });
  }

  // Generate mock access token & refresh token
  const accessToken = crypto.randomBytes(32).toString("hex");
  const refreshToken = crypto.randomBytes(32).toString("hex");
  tokens[refreshToken] = { accessToken };

  console.log(`✅ Issued Access Token: ${accessToken}`);

  res.json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 300, // 5 min expiration
    refresh_token: refreshToken,
  });
});

// 📌 Step 4: Refresh Token Endpoint
app.post("/connect/token/refresh", (req, res) => {
  const { refresh_token, client_id, grant_type } = req.body;

  if (grant_type !== "refresh_token" || !refresh_token) {
    return res.status(400).json({ error: "invalid_request" });
  }

  const savedToken = tokens[refresh_token];
  if (!savedToken) {
    return res.status(400).json({ error: "invalid_grant" });
  }

  // Generate a new access token
  const newAccessToken = crypto.randomBytes(32).toString("hex");
  tokens[refresh_token] = { accessToken: newAccessToken };

  console.log(`🔄 Refreshed Token: ${newAccessToken}`);

  res.json({
    access_token: newAccessToken,
    token_type: "Bearer",
    expires_in: 300, // 5 minutes
    refresh_token, // Keep the same refresh token
  });
});

// 📌 Step 5: User Info Endpoint
app.get("/connect/userinfo", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "missing_token" });
  }

  const accessToken = authHeader.split(" ")[1];
  const user = users["test-user"]; // Mock user data

  if (!user) {
    return res.status(401).json({ error: "invalid_token" });
  }

  console.log(`👤 User Info Requested: ${user.email}`);

  res.json(user);
});

app.listen(9000, () => {
  console.log("Mock OIDC provider running on http://localhost:9000");
});

app.get("/api/reports", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "missing_token", message: "No token provided" });
  }

  const accessToken = authHeader.split(" ")[1];
  const validTokens = Object.values(tokens).map((t) => t.accessToken);

  if (!validTokens.includes(accessToken)) {
    return res
      .status(403)
      .json({ error: "invalid_token", message: "Token is invalid or expired" });
  }

  console.log(`📄 Secure reports fetched using token: ${accessToken}`);

  res.json([
    { id: 1, name: "Monthly Sales Report", date: "2024-02-06" },
    { id: 2, name: "User Engagement Analysis", date: "2024-02-05" },
    { id: 3, name: "Revenue Forecast", date: "2024-02-04" },
  ]);
});
