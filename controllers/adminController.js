const College    = require("../models/College");
const AdminCourse= require("../models/AdminCourse");
const Notice     = require("../models/Notice");
const User       = require("../models/User");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");

// ── Admin Login ───────────────────────────────────────────────────────────
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "admin" });
    if (!user) return res.status(400).json({ message: "Invalid admin credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid admin credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, name: user.name, email: user.email, role: "admin" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── Seed admin (run once) ─────────────────────────────────────────────────
const seedAdmin = async (req, res) => {
  try {
    const exists = await User.findOne({ role: "admin" });
    if (exists) return res.json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({ name: "Admin", email: "admin@college.com", password: hashed, role: "admin" });
    res.json({ message: "Admin created: admin@college.com / admin123" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── COLLEGES ──────────────────────────────────────────────────────────────
const getColleges    = async (_, res) => res.json(await College.find().sort({ createdAt: -1 }));
const addCollege     = async (req, res) => { try { res.status(201).json(await College.create(req.body)); } catch (e) { res.status(500).json({ error: e.message }); } };
const updateCollege  = async (req, res) => { try { res.json(await College.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { res.status(500).json({ error: e.message }); } };
const deleteCollege  = async (req, res) => { try { await College.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) { res.status(500).json({ error: e.message }); } };

// ── COURSES ───────────────────────────────────────────────────────────────
const getCourses     = async (_, res) => res.json(await AdminCourse.find().sort({ createdAt: -1 }));
const addCourse      = async (req, res) => { try { res.status(201).json(await AdminCourse.create(req.body)); } catch (e) { res.status(500).json({ error: e.message }); } };
const updateCourse   = async (req, res) => { try { res.json(await AdminCourse.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { res.status(500).json({ error: e.message }); } };
const deleteCourse   = async (req, res) => { try { await AdminCourse.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) { res.status(500).json({ error: e.message }); } };

// ── NOTICES ───────────────────────────────────────────────────────────────
const getNotices     = async (_, res) => res.json(await Notice.find().sort({ createdAt: -1 }));
const addNotice      = async (req, res) => { try { res.status(201).json(await Notice.create(req.body)); } catch (e) { res.status(500).json({ error: e.message }); } };
const updateNotice   = async (req, res) => { try { res.json(await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { res.status(500).json({ error: e.message }); } };
const deleteNotice   = async (req, res) => { try { await Notice.findByIdAndDelete(req.params.id); res.json({ message: "Deleted" }); } catch (e) { res.status(500).json({ error: e.message }); } };

module.exports = {
  adminLogin, seedAdmin,
  getColleges, addCollege, updateCollege, deleteCollege,
  getCourses,  addCourse,  updateCourse,  deleteCourse,
  getNotices,  addNotice,  updateNotice,  deleteNotice,
};
