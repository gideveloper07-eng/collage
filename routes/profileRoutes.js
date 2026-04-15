const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const Profile = require("../models/Profile");

// 👉 GET PROFILE
router.get("/", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      userId: req.userId || "dummyUserId",
    });

    res.json(profile || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 👉 SAVE PROFILE (WITH FILE UPLOAD)
router.post(
  "/save",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        email,
        mobile,
        dob,
        gender,
        highestQualification,
        schoolCollegeName,
        boardUniversity,
        passingYear,
        percentageCgpa,
        subjectStream,
        entranceExam,
        rankScore,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        skills,
        interests,
        preferredCourse,
        preferredCollege,
      } = req.body;

      // ✅ FILES
      const profileImage = req.files["profileImage"]?.[0]?.filename || "";

      const documents =
        req.files["documents"]?.map((file) => file.filename) || [];

      // ✅ SAVE / UPDATE
      const updatedProfile = await Profile.findOneAndUpdate(
        { userId: req.userId || "dummyUserId" }, // replace with auth later
        {
          fullName: name,
          email,
          mobile,
          dob,
          gender,
          highestQualification,
          schoolCollegeName,
          boardUniversity,
          passingYear,
          percentageCgpa,
          subjectStream,
          entranceExam,
          rankScore,
          addressLine1,
          addressLine2,
          city,
          state,
          pincode,
          skills,
          interests,
          preferredCourse,
          preferredCollege,
          profileImage,
          documents,
        },
        { new: true, upsert: true },
      );

      console.log("FILES:", req.files); // 🔍 debug

      res.json({
        success: true,
        message: "Profile saved successfully",
        data: updatedProfile,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  },
);

module.exports = router;
