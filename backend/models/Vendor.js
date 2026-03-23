const mongoose = require("mongoose");

const VendorSchema = new mongoose.Schema(
  {
    company:      { type: String, required: true, trim: true },
    owner:        { type: String, required: true, trim: true },
    phone:        { type: String, required: true, unique: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    address:      { type: String, required: true },
    city:         { type: String, required: true },
    state:        { type: String, required: true },
    pin:          { type: String, required: true },
    capacityPerDay: { type: Number, required: true }, // in kg
    password:     { type: String, required: true },
    role:         { type: String, default: "vendor" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", VendorSchema);
