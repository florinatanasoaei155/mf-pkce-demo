import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import pg from "pg";
import fetch from "node-fetch";

const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Define a user object type
interface User {
  sub: string;
  name: string;
  email: string;
}

// Extend Express Request with the authenticated user
interface AuthenticatedRequest extends Request {
  user?: User;
}

// 📌 Middleware: Validate Token with Identity Server
const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "missing_token" });
    return next(); // Ensure middleware does not return a Response
  }

  try {
    const identityServerResponse = await fetch(
      `${process.env.IDENTITY_SERVER_URL}/connect/userinfo`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!identityServerResponse.ok) {
      res.status(403).json({ error: "invalid_token" });
      return next();
    }

    // ✅ Explicitly cast to User type
    const user = (await identityServerResponse.json()) as User;
    req.user = user;

    next();
  } catch (error) {
    console.error("Error validating token:", error);
    next(error); // Ensure Express error handler is triggered
  }
};

// 📌 Get Reports (Secured)
app.get(
  "/api/reports",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { rows } = await pool.query("SELECT * FROM reports");
      res.json(rows);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "database_error" });
    }
  }
);

// 📌 Express Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Unhandled Error:", err);
  res
    .status(500)
    .json({ error: "internal_server_error", message: err.message });
});

// 📌 Start API Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`🚀 API Server running on http://localhost:${PORT}`)
);
