import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import session from "express-session";
import { PrismaClient } from "@prisma/client";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaSessionStore } from "./services/prismaSessionStore.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });
}

const [
  { default: authRoutes },
  { default: orderRoutes },
  { default: adminRoutes },
  { default: contactRoutes },
  { ensureDefaultOrderCatalog },
] = await Promise.all([
  import("./routes/auth.js"),
  import("./routes/orders.js"),
  import("./routes/admin.js"),
  import("./routes/contact.js"),
  import("./services/orderService.js"),
]);

const app = express();
const prisma = new PrismaClient();
const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = process.env.PORT || 3000;
const frontendDistPath = fileURLToPath(new URL("../../dist/", import.meta.url));
const frontendIndexPath = path.join(frontendDistPath, "index.html");
let databaseReady = false;
let shutdownRequested = false;
let databaseRetryTimer;

if (NODE_ENV === "production") {
  for (const name of ["SESSION_SECRET", "JWT_SECRET"]) {
    if (!process.env[name] || process.env[name].length < 32) {
      throw new Error(`${name} must be set to a secret of at least 32 characters in production.`);
    }
  }
  if (!existsSync(frontendIndexPath)) {
    throw new Error("Frontend build not found. Run `npm run build` before starting the production server.");
  }
  app.set("trust proxy", 1);
}

// ==================== MIDDLEWARE ====================

// Body Parser
app.use("/api/orders", express.json({ limit: "7mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      ...(process.env.ADMIN_DASHBOARD_ORIGIN ? [process.env.ADMIN_DASHBOARD_ORIGIN] : []),
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Session Configuration
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-session-secret-change-in-production",
    ...(NODE_ENV === "production" && {
      store: new PrismaSessionStore(prisma),
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// ==================== ROUTES ====================

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API Version
app.get("/api/version", (req, res) => {
  res.json({
    version: "1.0.0",
    environment: NODE_ENV,
  });
});

app.get("/api/ready", (_req, res) => {
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? "ready" : "starting",
  });
});

app.use(
  ["/api/auth", "/api/orders", "/api/admin", "/api/contact"],
  (_req, res, next) => {
    if (databaseReady) return next();
    return res.status(503).json({
      error: {
        status: 503,
        message: "The service is starting. Please try again shortly.",
      },
    });
  },
);

// import profileRoutes from './routes/profile.js';
// import orderRoutes from './routes/orders.js';
// import referralRoutes from './routes/referrals.js';
// import couponRoutes from './routes/coupons.js';

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/referrals', referralRoutes);
// app.use('/api/coupons', couponRoutes);

if (NODE_ENV === "production") {
  app.use(express.static(frontendDistPath));
  app.get("*", (req, res, next) => {
    if (
      req.path === "/api" ||
      req.path.startsWith("/api/") ||
      !req.accepts("html")
    ) {
      return next();
    }
    res.sendFile(frontendIndexPath, (error) => {
      if (error) next(error);
    });
  });
}

// ==================== ERROR HANDLING ====================

app.use((err, _req, res, _next) => {
  console.error("Error:", err);

  const status =
    Number.isInteger(err?.status) && err.status >= 400 && err.status <= 599
      ? err.status
      : 500;
  const message =
    status >= 500
      ? "We’re having trouble completing this right now. Please try again shortly."
      : err?.type === "entity.parse.failed"
        ? "We couldn’t read that request. Check the information and try again."
        : err?.type === "entity.too.large"
          ? "That file is too large. Choose a smaller file and try again."
          : err?.message || "We couldn’t complete that request. Please try again.";

  res.status(status).json({
    error: {
      status,
      message,
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      status: 404,
      message: "Route not found",
    },
  });
});

// ==================== SERVER STARTUP ====================

let httpServer;

const initializeDatabase = async () => {
  try {
    await prisma.$connect();
    await ensureDefaultOrderCatalog();
    databaseReady = true;
    console.log("✓ Database connected");
    console.log("✓ Database initialization complete");
  } catch (error) {
    console.error("Database initialization failed; retrying in 10 seconds:", error);
    if (!shutdownRequested) {
      databaseRetryTimer = setTimeout(initializeDatabase, 10_000);
      databaseRetryTimer.unref();
    }
  }
};

const startServer = () => {
  httpServer = app.listen(PORT, "0.0.0.0", () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║  🚀 ARAINA Backend Server                                 ║
║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━║
║  Environment: ${NODE_ENV.padEnd(35)} ║
║  Port: ${PORT.toString().padEnd(45)} ║
║  API URL: /api                                             ║
║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━║
║  ✓ HTTP server accepting requests                        ║
╚══════════════════════════════════════════════════════════╝
      `);
    void initializeDatabase();
  });
};

const shutdown = async () => {
  shutdownRequested = true;
  if (databaseRetryTimer) clearTimeout(databaseRetryTimer);
  console.log("\nShutting down gracefully...");
  if (httpServer) {
    await new Promise((resolve) => httpServer.close(resolve));
  }
  await prisma.$disconnect();
};

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

startServer();
