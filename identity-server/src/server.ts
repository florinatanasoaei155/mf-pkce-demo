import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import crypto from "crypto";
import pg from "pg";

const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Define Request Types
interface AuthRequest extends Request {
  query: {
    redirect_uri?: string;
    state?: string;
  };
}

interface TokenRequest extends Request {
  body: {
    client_id?: string;
    redirect_uri?: string;
    grant_type?: string;
    code?: string;
    code_verifier?: string;
  };
}

// 📌 OIDC Discovery
app.get(
  "/.well-known/openid-configuration",
  (_: Request, res: Response): void => {
    res.json({
      issuer: "http://localhost:9000",
      authorization_endpoint: "http://localhost:9000/connect/authorize",
      token_endpoint: "http://localhost:9000/connect/token",
      userinfo_endpoint: "http://localhost:9000/connect/userinfo",
      scopes_supported: ["openid", "profile", "email"],
    });
  }
);

// 📌 Authorization Endpoint
app.get(
  "/connect/authorize",
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.query.redirect_uri || !req.query.state) {
        res
          .status(400)
          .json({
            error: "invalid_request",
            message: "Missing redirect_uri or state",
          });
        return;
      }

      const authCode = crypto.randomBytes(16).toString("hex");

      await pool.query(
        "INSERT INTO tokens (access_token, refresh_token, expires_at) VALUES ($1, $2, NOW() + INTERVAL '5 minutes')",
        [authCode, ""]
      );

      console.log(`✅ Issued Auth Code: ${authCode}`);

      res.redirect(
        `${req.query.redirect_uri}?code=${authCode}&state=${req.query.state}`
      );
    } catch (error) {
      console.error("Authorization error:", error);
      next(error);
    }
  }
);

// 📌 Token Exchange Endpoint
app.post(
  "/connect/token",
  async (
    req: TokenRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (
        !req.body.grant_type ||
        req.body.grant_type !== "authorization_code"
      ) {
        res
          .status(400)
          .json({
            error: "invalid_request",
            message: "Invalid or missing grant_type",
          });
        return;
      }

      if (!req.body.code) {
        res
          .status(400)
          .json({
            error: "invalid_request",
            message: "Missing authorization code",
          });
        return;
      }

      // Generate new access & refresh tokens
      const accessToken = crypto.randomBytes(32).toString("hex");
      const refreshToken = crypto.randomBytes(32).toString("hex");

      res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 300, // 5 minutes
      });
    } catch (error) {
      console.error("Token exchange error:", error);
      next(error);
    }
  }
);

// 📌 Express Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error("Unhandled Error:", err);
  res
    .status(500)
    .json({ error: "internal_server_error", message: err.message });
});

// 📌 Start Identity Server
const PORT = process.env.PORT || 9000;
app.listen(PORT, () =>
  console.log(`🚀 Identity Server running on http://localhost:${PORT}`)
);
