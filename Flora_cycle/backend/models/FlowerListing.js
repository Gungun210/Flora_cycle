const mongoose = require("mongoose");

const FlowerListingSchema = new mongoose.Schema(
  {
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },
    flowerType: {
      type: String,
      required: true, // e.g. "Marigold"
    },
    quantity: {
      type: Number,
      required: true, // in kg
    },
    condition: {
      type: String,
      enum: ["Fresh", "1 Day Old", "2 Days Old", "Mixed"],
      default: "Fresh",
    },
    urgency: {
      type: String,
      enum: ["Urgent", "Normal"],
      default: "Normal",
    },
    isActive: {
      type: Boolean,
      default: true, // false = removed by temple
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FlowerListing", FlowerListingSchema);