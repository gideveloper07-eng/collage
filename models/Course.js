const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: String,
    department: String,
    duration: String,       // e.g. "4 Years"
    fees: Number,
    seats: Number,
    description: String,
    image: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Course", courseSchema);
