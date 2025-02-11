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

// 📌 Utility: Read & Write Database JSON
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
const writeDB = (data) =>
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// 📌 Generate JWT Tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ sub: userId }, "secret", { expiresIn: "5m" });
  const refreshToken = crypto.randomBytes(32).toString("hex");
  return { accessToken, refreshToken };
};

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

// 📌 User Login
app.post("/auth/login", (req, res) => {
  const db = readDB();
  const { email, password, redirect_uri } = req.body;

  const user = db.users[email];
  if (!user || user.password !== password) {
    return res.status(401).json({
      error: "invalid_credentials",
      message: "Invalid email or password",
    });
  }

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

// 📌 OIDC Discovery Endpoint
app.get("/.well-known/openid-configuration", (_, res) => {
  res.json({
    issuer: "http://localhost:9000",
    authorization_endpoint: "http://localhost:9000/connect/authorize",
    token_endpoint: "http://localhost:9000/connect/token",
    userinfo_endpoint: "http://localhost:9000/connect/userinfo",
    end_session_endpoint: "http://localhost:9000/connect/logout",
    scopes_supported: ["openid", "profile", "email"],
    response_types_supported: ["code"],
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

// 📌 Token Refresh Endpoint
app.post("/connect/token/refresh", (req, res) => {
  const db = readDB();
  const { refresh_token, grant_type } = req.body;

  if (grant_type !== "refresh_token" || !refresh_token) {
    return res.status(400).json({ error: "invalid_request" });
  }

  if (!db.tokens[refresh_token]) {
    return res.status(400).json({ error: "invalid_grant" });
  }

  const { accessToken, refreshToken: newRefreshToken } =
    generateTokens("1234567890");
  db.tokens[newRefreshToken] = { accessToken };
  delete db.tokens[refresh_token]; // Remove old refresh token
  writeDB(db);

  res.json({
    access_token: accessToken,
    refresh_token: newRefreshToken,
    expires_in: 300,
  });
});

// 📌 Logout Endpoint
app.get("/connect/logout", (req, res) => {
  const { post_logout_redirect_uri } = req.query;

  console.log(`👋 Logging out user...`);
  const db = readDB();
  db.tokens = {}; // Clear stored tokens
  writeDB(db);

  res.redirect(post_logout_redirect_uri || "http://localhost:5173/login");
});

// 📌 User Info Endpoint
app.get("/connect/userinfo", authenticate, (req, res) => {
  const db = readDB();
  const user = db.users["test-user"];

  if (!user) return res.status(401).json({ error: "invalid_token" });

  res.json({ sub: user.sub, name: user.name, email: user.email });
});

// 📌 Reports API (Protected)
app.get("/api/reports", authenticate, (req, res) => {
  res.json(readDB().reports);
});

// 📌 Fetch a Single Report
app.get("/api/reports/:id", authenticate, (req, res) => {
  const db = readDB();
  const report = db.reports.find((r) => r.id === parseInt(req.params.id));

  if (!report) return res.status(404).json({ error: "not_found" });

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
  db.reports = db.reports.filter((r) => r.id !== parseInt(req.params.id));
  writeDB(db);
  res.status(204).send();
});

// 📌 Start API Server
app.listen(9000, () =>
  console.log("✅ Mock OIDC & API Server running on http://localhost:9000")
);
