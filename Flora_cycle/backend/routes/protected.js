const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const Temple = require("../models/Temple");
const Vendor = require("../models/Vendor");

const router = express.Router();

// ── GET /api/dashboard ──
// Any logged-in user (temple or vendor) can access
router.get("/dashboard", protect, async (req, res) => {
  try {
    let user;
    if (req.user.role === "temple") {
      user = await Temple.findById(req.user.id).select("-password");
    } else {
      user = await Vendor.findById(req.user.id).select("-password");
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Welcome to your dashboard", role: req.user.role, user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/temple/profile ──
// Only temples can access
router.get("/temple/profile", protect, restrictTo("temple"), async (req, res) => {
  const temple = await Temple.findById(req.user.id).select("-password");
  res.json(temple);
});

// ── GET /api/vendor/profile ──
// Only vendors can access
router.get("/vendor/profile", protect, restrictTo("vendor"), async (req, res) => {
  const vendor = await Vendor.findById(req.user.id).select("-password");
  res.json(vendor);
});

module.exports = router;
