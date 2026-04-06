import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth.js";
import { envVars } from "./app/config/env.js";
import IndexRoutes from "./app/routes/index.js";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler.js";
import { notFound } from "./app/middleware/notFound.js";

const app = express();

// 1. Payment webhook — raw body BEFORE JSON parser
app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }));

// 2. CORS
app.use(cors({ origin: envVars.FRONTEND_URL, credentials: true }));

// 3. Auth library handler — BEFORE body parsers
app.all(/^\/api\/auth(\/.*)?$/, toNodeHandler(auth));

// 4. Body parsers
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// 5. API routes
app.use("/api/v1", IndexRoutes);

// 6. Health check
app.get("/", (_req, res) => {
  res.json({ success: true, message: "EcoSpark Hub API is running" });
});

// 7. Global error handler
app.use(globalErrorHandler);

// 8. 404 handler
app.use(notFound);

export default app;
