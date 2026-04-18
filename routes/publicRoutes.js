const express     = require("express");
const router      = express.Router();
const College     = require("../models/College");
const AdminCourse = require("../models/AdminCourse");
const Notice      = require("../models/Notice");
const Application = require("../models/Application");
const jwt         = require("jsonwebtoken");

const getUserId = (req) => {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try { return jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET).id; }
  catch { return null; }
};

// ── Colleges with search + filter ────────────────────────────────────────
router.get("/colleges", async (req, res) => {
  try {
    const { q, type, city } = req.query;
    const filter = {};
    if (q)    filter.name     = { $regex: q, $options: "i" };
    if (type) filter.type     = type;
    if (city) filter.location = { $regex: city, $options: "i" };
    res.json(await College.find(filter).sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Courses with search + filter ──────────────────────────────────────────
router.get("/courses", async (req, res) => {
  try {
    const { q, department } = req.query;
    const filter = {};
    if (q)          filter.title      = { $regex: q, $options: "i" };
    if (department) filter.department = { $regex: department, $options: "i" };
    res.json(await AdminCourse.find(filter).sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── Notices ───────────────────────────────────────────────────────────────
router.get("/notices", async (_, res) =>
  res.json(await Notice.find().sort({ createdAt: -1 }))
);

// ── User notifications (notices + application status updates) ─────────────
router.get("/notifications", async (req, res) => {
  try {
    const userId = getUserId(req);
    const notices = await Notice.find().sort({ createdAt: -1 }).limit(20);

    // Build notification list
    const notifs = notices.map(n => ({
      id:       n._id,
      type:     "notice",
      title:    n.title,
      body:     n.body,
      category: n.category,
      time:     n.createdAt,
    }));

    // Add application status updates if user is logged in
    if (userId) {
      const apps = await Application.find({ userId, status: { $ne: "Under Review" } })
        .sort({ updatedAt: -1 }).limit(10);
      for (const app of apps) {
        notifs.unshift({
          id:       app._id,
          type:     "application",
          title:    app.status === "Accepted"
            ? "🎉 Application Accepted!"
            : "❌ Application Update",
          body:     app.status === "Accepted"
            ? `Your application to ${app.college} for ${app.course} has been accepted.`
            : `Your application to ${app.college} for ${app.course} was rejected.`,
          category: app.status === "Accepted" ? "Accepted" : "Rejected",
          time:     app.updatedAt,
        });
      }
    }

    // Sort by time descending
    notifs.sort((a, b) => new Date(b.time) - new Date(a.time));
    res.json(notifs);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
