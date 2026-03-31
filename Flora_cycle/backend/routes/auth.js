const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Temple = require("../models/Temple");
const Vendor = require("../models/Vendor");

const router = express.Router();

// ── Helper: generate JWT ──
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });


// ────────────────────────────────────────
// POST /api/auth/register
// Body: { role: "temple"|"vendor", ...fields }
// ────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { role, password, ...rest } = req.body;

    if (!role || !password) {
      return res.status(400).json({ message: "Role and password are required" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    let user;

    if (role === "temple") {
      const { name, contact, phone, email, address, city, state, pin, type, waste } = rest;

      // Check if already registered
      const exists = await Temple.findOne({ $or: [{ email }, { phone }] });
      if (exists) return res.status(409).json({ message: "Temple already registered with this email or phone" });

      user = await Temple.create({
        name, contact, phone, email,
        address, city, state, pin,
        templeType: type,
        wastePerDay: waste,
        password: hashedPassword,
      });

    } else if (role === "vendor") {
      const { company, owner, phone, email, address, city, state, pin, capacity } = rest;

      const exists = await Vendor.findOne({ $or: [{ email }, { phone }] });
      if (exists) return res.status(409).json({ message: "Vendor already registered with this email or phone" });

      user = await Vendor.create({
        company, owner, phone, email,
        address, city, state, pin,
        capacityPerDay: capacity,
        password: hashedPassword,
      });

    } else {
      return res.status(400).json({ message: "Invalid role. Must be 'temple' or 'vendor'" });
    }

    const token = generateToken(user._id, role);

    res.status(201).json({
      message: "Registration successful",
      token,
      role,
      user: {
        id: user._id,
        name: role === "temple" ? user.name : user.company,
        email: user.email,
        city: user.city,
      },
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});


// ────────────────────────────────────────
// POST /api/auth/login
// Body: { role: "temple"|"vendor", identifier: email or phone, password }
// ────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { role, identifier, password } = req.body;

    if (!role || !identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user;
    const isEmail = identifier.includes("@");

    if (role === "temple") {
      user = isEmail
        ? await Temple.findOne({ email: identifier })
        : await Temple.findOne({ phone: identifier });
    } else if (role === "vendor") {
      user = isEmail
        ? await Vendor.findOne({ email: identifier })
        : await Vendor.findOne({ phone: identifier });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ message: "No account found with these details" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = generateToken(user._id, role);

    res.status(200).json({
      message: "Login successful",
      token,
      role,
      user: {
        id: user._id,
        name: role === "temple" ? user.name : user.company,
        email: user.email,
        city: user.city,
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
