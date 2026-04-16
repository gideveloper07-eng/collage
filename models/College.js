const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    location: { type: String, default: "" },
    type:     { type: String, default: "Private" }, // Government / Private / Deemed
    rating:   { type: String, default: "4.0" },
    courses:  { type: String, default: "0" },
    description: { type: String, default: "" },
    image:    { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("College", collegeSchema);
