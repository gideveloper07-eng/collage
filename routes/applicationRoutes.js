const express = require("express");
const router  = express.Router();
const Application = require("../models/Application");
const jwt = require("jsonwebtoken");

// ── Auth helper ───────────────────────────────────────────────────────────
const getUserId = (req) => {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    return jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET).id;
  } catch { return null; }
};

// POST /api/applications  — submit application
router.post("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { college, course, message, userName } = req.body;
    if (!college || !course)
      return res.status(400).json({ message: "College and course are required" });

    // Prevent duplicate application to same college+course
    const exists = await Application.findOne({ userId, college, course });
    if (exists)
      return res.status(400).json({ message: "You already applied to this college for this course" });

    const app = await Application.create({ userId, userName, college, course, message });
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications  — get my applications
router.get("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const apps = await Application.find({ userId }).sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/applications/count  — get count for dashboard
router.get("/count", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const count = await Application.countDocuments({ userId });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: GET all applications
router.get("/all", async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: PATCH status
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
