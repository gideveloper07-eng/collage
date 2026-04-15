const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },

    // Personal
    fullName:    { type: String, default: "" },
    email:       { type: String, default: "" },
    mobile:      { type: String, default: "" },
    dob:         { type: String, default: "" },
    gender:      { type: String, default: "Male" },
    profileImage:{ type: String, default: "" },

    // Academic
    highestQualification: { type: String, default: "" },
    schoolCollegeName:    { type: String, default: "" },
    boardUniversity:      { type: String, default: "" },
    passingYear:          { type: String, default: "" },
    percentageCgpa:       { type: String, default: "" },
    subjectStream:        { type: String, default: "" },
    entranceExam:         { type: String, default: "" },
    rankScore:            { type: String, default: "" },

    // Address
    addressLine1: { type: String, default: "" },
    addressLine2: { type: String, default: "" },
    city:         { type: String, default: "" },
    state:        { type: String, default: "" },
    pincode:      { type: String, default: "" },

    // Documents
    marksheet10:   { type: String, default: "" },
    marksheet12:   { type: String, default: "" },
    idProof:       { type: String, default: "" },
    passportPhoto: { type: String, default: "" },

    // Additional
    skills:           { type: String, default: "" },
    interests:        { type: String, default: "" },
    preferredCourse:  { type: String, default: "" },
    preferredCollege: { type: String, default: "" },

    // System
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
