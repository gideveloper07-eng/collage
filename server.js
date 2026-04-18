const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const https    = require("https");
const http_mod = require("http");
require("dotenv").config();

const authRoutes        = require("./routes/authRoutes");
const profileRoutes     = require("./routes/profileRoutes");
const adminRoutes       = require("./routes/adminRoutes");
const publicRoutes      = require("./routes/publicRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const wishlistRoutes    = require("./routes/wishlistRoutes");
const agentRoutes       = require("./routes/agentRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ── Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth",         authRoutes);
app.use("/api/profile",      profileRoutes);
app.use("/api/admin",        adminRoutes);
app.use("/api/public",       publicRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/wishlist",     wishlistRoutes);
app.use("/api/agent",       agentRoutes);

// Health check — returns JSON so Flutter can detect server is awake
app.get("/", (_, res) => res.json({ status: "ok", time: Date.now() }));
app.get("/ping", (_, res) => res.json({ pong: true }));

// ── MongoDB ───────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

// ── Start server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

// ── Self-ping every 14 minutes to prevent Render free-tier sleep ──────────
const RENDER_URL = process.env.RENDER_URL || `http://localhost:${PORT}`;

setInterval(() => {
  const url = new URL(RENDER_URL + "/ping");
  const mod = url.protocol === "https:" ? https : http_mod;
  const req = mod.get(url.toString(), (res) => {
    console.log(`🏓 Self-ping: ${res.statusCode}`);
  });
  req.on("error", (e) => console.log("Ping error:", e.message));
  req.end();
}, 14 * 60 * 1000); // every 14 minutes
