const mongoose = require("mongoose");

const TempleSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    contact:     { type: String, required: true, trim: true },
    phone:       { type: String, required: true, unique: true, trim: true },
    email:       { type: String, required: true, unique: true, lowercase: true, trim: true },
    address:     { type: String, required: true },
    city:        { type: String, required: true },
    state:       { type: String, required: true },
    pin:         { type: String, required: true },
    templeType:  { type: String, enum: ["Small", "Medium", "Large"], default: "Medium" },
    wastePerDay: { type: Number, required: true }, // in kg
    password:    { type: String, required: true },
    role:        { type: String, default: "temple" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Temple", TempleSchema);
