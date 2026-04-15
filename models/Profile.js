const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },

    // Personal Info
    fullName:    String,
    email:       String,
    mobile:      String,
    dob:         String,
    gender:      String,
    profilePhoto: String,

    // Academic Details
    highestQualification: String,
    schoolCollegeName:    String,
    boardUniversity:      String,
    passingYear:          String,
    percentageCgpa:       String,
    subjectStream:        String,
    entranceExam:         String,
    rankScore:            String,

    // Address
    addressLine1: String,
    addressLine2: String,
    city:         String,
    state:        String,
    pincode:      String,

    // Documents
    marksheet10:  String,
    marksheet12:  String,
    idProof:      String,
    passportPhoto: String,

    // Additional
    skills:           String,
    interests:        String,
    preferredCourse:  String,
    preferredCollege: String,

    // System
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
