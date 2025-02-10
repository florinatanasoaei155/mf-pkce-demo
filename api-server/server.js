require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 📌 Middleware: Validate Token with Identity Server
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "missing_token" });
  }

  try {
    const identityServerResponse = await fetch(
      `${process.env.IDENTITY_SERVER_URL}/connect/userinfo`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!identityServerResponse.ok) {
      return res.status(403).json({ error: "invalid_token" });
    }

    req.user = await identityServerResponse.json();
    next();
  } catch (error) {
    return res.status(500).json({ error: "identity_server_error" });
  }
};

// 📌 Get Reports (Secured)
app.get("/api/reports", authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM reports");
    res.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "database_error" });
  }
});

// 📌 Start API Server
app.listen(8000, () =>
  console.log("🚀 API Server running on http://localhost:8000")
);
