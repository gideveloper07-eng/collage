const express  = require("express");
const router   = express.Router();
const Wishlist = require("../models/Wishlist");
const jwt      = require("jsonwebtoken");

const getUserId = (req) => {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try { return jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET).id; }
  catch { return null; }
};

// GET my wishlist
router.get("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    res.json(await Wishlist.find({ userId }).sort({ createdAt: -1 }));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST add to wishlist
router.post("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { collegeId, collegeName, location, type, rating } = req.body;
    const exists = await Wishlist.findOne({ userId, collegeId });
    if (exists) return res.status(400).json({ message: "Already in wishlist" });
    const item = await Wishlist.create({ userId, collegeId, collegeName, location, type, rating });
    res.status(201).json(item);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE remove from wishlist
router.delete("/:collegeId", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    await Wishlist.findOneAndDelete({ userId, collegeId: req.params.collegeId });
    res.json({ message: "Removed" });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET check if college is in wishlist
router.get("/check/:collegeId", async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.json({ saved: false });
    const exists = await Wishlist.findOne({ userId, collegeId: req.params.collegeId });
    res.json({ saved: !!exists });
  } catch (e) { res.status(500).json({ saved: false }); }
});

module.exports = router;
