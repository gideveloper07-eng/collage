const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  collegeId: { type: String, required: true },
  collegeName: { type: String, default: "" },
  location:  { type: String, default: "" },
  type:      { type: String, default: "" },
  rating:    { type: String, default: "" },
}, { timestamps: true });
wishlistSchema.index({ userId: 1, collegeId: 1 }, { unique: true });
module.exports = mongoose.model("Wishlist", wishlistSchema);
