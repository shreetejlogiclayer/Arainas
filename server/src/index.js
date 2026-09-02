import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ==================== MIDDLEWARE ====================

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
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
    resave: false,
    saveUninitialized: true,
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

// API Version
app.get("/api/version", (req, res) => {
  res.json({
    version: "1.0.0",
    environment: NODE_ENV,
  });
});

// Import route modules
import authRoutes from "./routes/auth.js";
// import profileRoutes from './routes/profile.js';
// import orderRoutes from './routes/orders.js';
// import referralRoutes from './routes/referrals.js';
// import couponRoutes from './routes/coupons.js';

// Use routes
app.use("/api/auth", authRoutes);
// app.use('/api/profile', profileRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/referrals', referralRoutes);
// app.use('/api/coupons', couponRoutes);

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error("Error:", err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: {
      status,
      message,
      ...(NODE_ENV === "development" && { details: err.stack }),
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

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log("✓ Database connected");

    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════════════╗
║  🚀 ARAINA Backend Server                                 ║
║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━║
║  Environment: ${NODE_ENV.padEnd(35)} ║
║  Port: ${PORT.toString().padEnd(45)} ║
║  API URL: http://localhost:${PORT}/api                  ║
║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━║
║  ✓ Server running                                         ║
║  ✓ Database connected                                    ║
║  ✓ Ready for requests                                    ║
╚══════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
