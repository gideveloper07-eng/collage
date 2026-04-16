const mongoose = require("mongoose");

const adminCourseSchema = new mongoose.Schema(
  {
    title:      { type: String, required: true },
    department: { type: String, default: "" },
    duration:   { type: String, default: "" },
    fees:       { type: String, default: "" },
    seats:      { type: Number, default: 0 },
    description:{ type: String, default: "" },
    college:    { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminCourse", adminCourseSchema);
