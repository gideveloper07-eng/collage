const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    title: String,
    brand: String,
    price: Number,
    fuelType: String,
    transmission: String,
    year: Number,
    kmDriven: Number,
    location: String,
    images: [String],
    description: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Car", carSchema);
