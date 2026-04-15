const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Personal Info
    fullName: { type: String, default: "" },
    email: {
      type: String,
      match: /.+\@.+\..+/,
      default: "",
    },
    mobile: { type: String, minlength: 10, maxlength: 10 },
    dob: { type: String, default: "" },
    gender: { type: String, default: "Male" },
    profileImage: { type: String, default: "" },

    // Academic
    highestQualification: String,
    schoolCollegeName: String,
    boardUniversity: String,
    passingYear: String,
    percentageCgpa: String,
    subjectStream: String,
    entranceExam: String,
    rankScore: String,

    // Address
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,

    // Documents (🔥 scalable)
    documents: [
      {
        type: { type: String }, // "10th", "aadhaar"
        file: { type: String },
      },
    ],

    // Additional
    skills: String,
    interests: String,
    preferredCourse: String,
    preferredCollege: String,

    // System
    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Index
profileSchema.index({ userId: 1 });

// Auto completion
profileSchema.pre("save", function (next) {
  if (this.fullName && this.email && this.mobile) {
    this.profileCompleted = true;
  }
  next();
});

module.exports = mongoose.model("Profile", profileSchema);
