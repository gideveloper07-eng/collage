const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    title:   { type: String, required: true },
    body:    { type: String, required: true },
    category:{ type: String, default: "General" }, // Admission / Exam / Event / General
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", noticeSchema);
