const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");

// Helper: get userId from token
const getUserId = (req) => {
  const auth = req.headers.authorization;
  if (!auth) return null;
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
};

// GET profile
const getProfile = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const profile = await Profile.findOne({ userId });
    if (!profile) return res.json(null);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE or UPDATE profile
const saveProfile = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const data = { ...req.body, userId };

    // Mark complete if key fields filled
    if (data.fullName && data.mobile && data.highestQualification) {
      data.profileCompleted = true;
    }

    const profile = await Profile.findOneAndUpdate(
      { userId },
      data,
      { upsert: true, new: true }
    );

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, saveProfile };
