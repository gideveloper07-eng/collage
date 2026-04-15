const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ── Multer storage ────────────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Export multer middleware for use in routes
const uploadFields = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "marksheet10",  maxCount: 1 },
  { name: "marksheet12",  maxCount: 1 },
  { name: "idProof",      maxCount: 1 },
  { name: "passportPhoto",maxCount: 1 },
]);

// ── Helper ────────────────────────────────────────────────────────────────────
const getUserId = (req) => {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const token = auth.split(" ")[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET).id;
  } catch {
    return null;
  }
};

// ── GET profile ───────────────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const profile = await Profile.findOne({ userId });
    res.json(profile || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── SAVE profile (text + files) ───────────────────────────────────────────────
const saveProfile = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const data = { ...req.body, userId };
    const files = req.files || {};
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // Attach uploaded file URLs
    if (files.profileImage)
      data.profileImage = `${baseUrl}/uploads/${files.profileImage[0].filename}`;
    if (files.marksheet10)
      data.marksheet10  = `${baseUrl}/uploads/${files.marksheet10[0].filename}`;
    if (files.marksheet12)
      data.marksheet12  = `${baseUrl}/uploads/${files.marksheet12[0].filename}`;
    if (files.idProof)
      data.idProof      = `${baseUrl}/uploads/${files.idProof[0].filename}`;
    if (files.passportPhoto)
      data.passportPhoto= `${baseUrl}/uploads/${files.passportPhoto[0].filename}`;

    if (data.fullName && data.mobile && data.highestQualification)
      data.profileCompleted = true;

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { $set: data },
      { upsert: true, new: true }
    );

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, saveProfile, uploadFields };
