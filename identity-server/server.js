require("dotenv").config();
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 📌 OIDC Discovery
app.get("/.well-known/openid-configuration", (_, res) => {
  res.json({
    issuer: "http://localhost:9000",
    authorization_endpoint: "http://localhost:9000/connect/authorize",
    token_endpoint: "http://localhost:9000/connect/token",
    userinfo_endpoint: "http://localhost:9000/connect/userinfo",
    scopes_supported: ["openid", "profile", "email"],
  });
});

// 📌 Authorization
app.get("/connect/authorize", async (req, res) => {
  const authCode = crypto.randomBytes(16).toString("hex");
  await pool.query(
    "INSERT INTO tokens (access_token, refresh_token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '5 minutes')",
    [authCode, ""]
  );

  console.log(`✅ Issued Auth Code: ${authCode}`);
  res.redirect(
    `${req.query.redirect_uri}?code=${authCode}&state=${req.query.state}`
  );
});

// 📌 Token Exchange
app.post("/connect/token", async (req, res) => {
  const accessToken = crypto.randomBytes(32).toString("hex");
  const refreshToken = crypto.randomBytes(32).toString("hex");
  res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_in: 300,
  });
});

app.listen(9000, () =>
  console.log("🚀 Identity Server running on http://localhost:9000")
);
