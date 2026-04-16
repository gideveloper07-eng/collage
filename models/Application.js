const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, default: "" },
    college:  { type: String, required: true },
    course:   { type: String, required: true },
    message:  { type: String, default: "" },
    status:   { type: String, default: "Under Review" }, // Under Review | Accepted | Rejected
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
