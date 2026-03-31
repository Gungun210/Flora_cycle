const mongoose = require("mongoose");

const PickupSchema = new mongoose.Schema(
  {
    // Who is offering flowers
    temple: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Temple",
      required: true,
    },
    // Who is collecting
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      default: null,
    },
    // Flower details
    flowerType: {
      type: String,
      required: true, // e.g. "Marigold, Rose"
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
    // Pickup status flow:
    // pending → accepted → completed
    // pending → rejected
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "rejected"],
      default: "pending",
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
    completedDate: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pickup", PickupSchema);