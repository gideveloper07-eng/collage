const express = require("express");
const router = express.Router();
const { getProfile, saveProfile } = require("../controllers/profileController");
const upload = require("../config/multer");

router.get("/", getProfile);
router.post("/", saveProfile);
router.post(
  "/save",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const { name, email } = req.body;

      const profileImage = req.files["profileImage"]?.[0]?.filename;
      const documents = req.files["documents"]?.map((f) => f.filename);

      res.json({
        message: "Uploaded successfully",
        profileImage,
        documents,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

module.exports = router;
