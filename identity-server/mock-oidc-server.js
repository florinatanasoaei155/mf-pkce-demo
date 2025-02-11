const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB_PATH = path.join(__dirname, "database.json");

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
const writeDB = (data) =>
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// 📌 Generate JWT Tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ sub: userId }, "secret", { expiresIn: "5m" });
  const refreshToken = crypto.randomBytes(32).toString("hex");
  return { accessToken, refreshToken };
};

let tokens = {};

// 📌 Middleware: Validate Access Token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "missing_token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secret");
    next();
  } catch (err) {
    res.status(403).json({ error: "invalid_token" });
  }
};

// 📌 User Login (before OIDC Authorization)
app.post("/auth/login", (req, res) => {
  const db = readDB();
  const { email, password, redirect_uri } = req.body;

  // Check if user exists in database.json
  const user = db.users[email];
  if (!user || user.password !== password) {
    return res.status(401).json({
      error: "invalid_credentials",
      message: "Invalid email or password",
    });
  }

  // Generate an authorization code for PKCE
  const authCode = crypto.randomBytes(16).toString("hex");
  db.authCodes[authCode] = {
    code_challenge: "mock_challenge",
    redirect_uri,
    email,
  };
  writeDB(db);

  console.log(`✅ Issued Auth Code for ${email}: ${authCode}`);

  res.json({ authorization_code: authCode });
});

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

// 📌 Authorization Endpoint (PKCE Flow)
app.get("/connect/authorize", (req, res) => {
  const { client_id, redirect_uri, response_type, state, code_challenge } =
    req.query;
  if (
    !client_id ||
    !redirect_uri ||
    !response_type ||
    !state ||
    !code_challenge
  ) {
    return res.status(400).json({ error: "invalid_request" });
  }

  const authCode = crypto.randomBytes(16).toString("hex");
  const db = readDB();
  db.authCodes[authCode] = { code_challenge, redirect_uri };
  writeDB(db);

  console.log(`✅ Issued Auth Code: ${authCode}`);
  res.redirect(`${redirect_uri}?code=${authCode}&state=${state}`);
});

// 📌 Token Exchange Endpoint
app.post("/connect/token", (req, res) => {
  const db = readDB();
  const { code, redirect_uri, grant_type, code_verifier } = req.body;

  if (grant_type !== "authorization_code" || !code || !code_verifier) {
    return res.status(400).json({ error: "invalid_request" });
  }

  if (!db.authCodes[code] || db.authCodes[code].redirect_uri !== redirect_uri) {
    return res.status(400).json({ error: "invalid_grant" });
  }

  const { accessToken, refreshToken } = generateTokens("1234567890");
  db.tokens[refreshToken] = { accessToken };
  delete db.authCodes[code];
  writeDB(db);

  res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: 300,
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

app.get("/connect/logout", (req, res) => {
  const { id_token_hint, post_logout_redirect_uri } = req.query;

  console.log(`👋 Logging out user...`);
  tokens = {}; // Clear all stored tokens
  res.clearCookie("oidc"); // If using cookies, clear them

  res.redirect(post_logout_redirect_uri || "http://localhost:5173/login");
});

// 📌 User Info Endpoint
app.get("/connect/userinfo", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "missing_token" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, "secret");
    const user = readDB().users["test-user"];
    if (!user) return res.status(401).json({ error: "invalid_token" });

    res.json({ sub: user.sub, name: user.name, email: user.email });
  } catch (err) {
    res.status(401).json({ error: "invalid_token" });
  }
});

// 📌 Reports API (Protected)
app.get("/api/reports", authenticate, (req, res) => {
  res.json(readDB().reports);
});

// 📌 Fetch a Single Report
app.get("/api/reports/:id", authenticate, (req, res) => {
  const db = readDB();
  const report = db.reports.find((r) => r.id === parseInt(req.params.id));

  if (!report) {
    return res
      .status(404)
      .json({ error: "not_found", message: "Report not found" });
  }

  res.json(report);
});

// 📌 Create Report
app.post("/api/reports", authenticate, (req, res) => {
  const db = readDB();
  const { name, date } = req.body;
  const newReport = { id: db.reports.length + 1, name, date };
  db.reports.push(newReport);
  writeDB(db);

  res.status(201).json(newReport);
});

// 📌 Update Report
app.put("/api/reports/:id", authenticate, (req, res) => {
  const db = readDB();
  const report = db.reports.find((r) => r.id === parseInt(req.params.id));
  if (!report) return res.status(404).json({ error: "not_found" });

  report.name = req.body.name;
  report.date = req.body.date;
  writeDB(db);
  res.json(report);
});

// 📌 Delete Report
app.delete("/api/reports/:id", authenticate, (req, res) => {
  const db = readDB();
  const reportIndex = db.reports.findIndex(
    (r) => r.id === parseInt(req.params.id)
  );
  if (reportIndex === -1) return res.status(404).json({ error: "not_found" });

  db.reports.splice(reportIndex, 1);
  writeDB(db);
  res.status(204).send();
});

// 📌 Start API Server
app.listen(9000, () => {
  console.log("Mock API server running on http://localhost:9000");
});
