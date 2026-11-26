const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const authRoutes = require("./routes/auth");
const personalRoutes = require("./routes/personalRoutes");
const educationRoutes = require("./routes/education");
const projectRoutes = require("./routes/projects");
const skillRoutes = require("./routes/skills");
const contactRoutes = require("./routes/contact");
const uploadRoutes = require("./routes/upload");
const { apiLimiter } = require("./middlewares/rateLimiter");
const {
  errorHandler,
  notFoundHandler,
} = require("./middlewares/errorHandler");

const app = express();

// Trust first proxy when running behind reverse proxies (Cloudflare Tunnel, Nginx, etc.)
app.set("trust proxy", 1);

// Security Headers with CSP allowing external portfolio images, Google Fonts, and blob previews
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'"],
        scriptSrcAttr: ["'none'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        connectSrc: ["'self'", "https:"],
        upgradeInsecureRequests: null,
      },
    },
  }),
);

// Cross-Origin Resource Sharing (CORS) Configuration
const clientOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...clientOrigins,
  process.env.APP_BASE_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy does not allow this origin"));
    },
    credentials: true,
  }),
);

// Serve Static Uploaded Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// General Body Parsing
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Apply General Rate Limiter to all API endpoints
app.use("/api", apiLimiter);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Application Routes
app.use(personalRoutes);
app.use(authRoutes);
app.use(educationRoutes);
app.use(projectRoutes);
app.use(skillRoutes);
app.use(contactRoutes);
app.use(uploadRoutes);

// Serve built Vue frontend (for single-domain production / Cloudflare Tunnel)
const frontendDistPath = path.resolve(__dirname, "../frontend/dist");
const frontendIndexPath = path.join(frontendDistPath, "index.html");
if (fs.existsSync(frontendIndexPath)) {
  app.use(express.static(frontendDistPath));

  app.use((req, res, next) => {
    if (
      req.method !== "GET" ||
      req.path.startsWith("/api") ||
      req.path.startsWith("/uploads")
    ) {
      return next();
    }
    return res.sendFile(frontendIndexPath);
  });
}

// 404 Handler for undefined API/upload routes
app.use(notFoundHandler);

// Global Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
