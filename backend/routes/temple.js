const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const Temple = require("../models/Temple");
const Pickup = require("../models/Pickup");
const FlowerListing = require("../models/FlowerListing");

const router = express.Router();

// All routes here require login + temple role
router.use(protect);
router.use(restrictTo("temple"));


// ────────────────────────────────────────
// GET /api/temple/dashboard
// Returns all data needed for temple dashboard overview
// ────────────────────────────────────────
router.get("/dashboard", async (req, res) => {
  try {
    const templeId = req.user.id;

    // Get temple profile
    const temple = await Temple.findById(templeId).select("-password");

    // Get all pickups for this temple
    const allPickups = await Pickup.find({ temple: templeId })
      .populate("vendor", "company city")
      .sort({ createdAt: -1 });

    // Stats
    const completed  = allPickups.filter(p => p.status === "completed");
    const pending    = allPickups.filter(p => p.status === "pending");
    const accepted   = allPickups.filter(p => p.status === "accepted");

    const totalRecycled = completed.reduce((sum, p) => sum + p.quantity, 0);
    const totalPickups  = completed.length;

    // Get active listings
    const listings = await FlowerListing.find({ temple: templeId, isActive: true });

    res.json({
      temple,
      stats: {
        totalRecycled,
        totalPickups,
        pendingRequests: pending.length,
        acceptedPickups: accepted.length,
      },
      recentPickups: allPickups.slice(0, 5),
      listings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ────────────────────────────────────────
// GET /api/temple/pickups
// Get all pickups for this temple
// ────────────────────────────────────────
router.get("/pickups", async (req, res) => {
  try {
    const pickups = await Pickup.find({ temple: req.user.id })
      .populate("vendor", "company city phone")
      .sort({ createdAt: -1 });

    res.json(pickups);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ────────────────────────────────────────
// PATCH /api/temple/pickups/:id/accept
// Temple accepts a pickup request from vendor
// ────────────────────────────────────────
router.patch("/pickups/:id/accept", async (req, res) => {
  try {
    const pickup = await Pickup.findOne({
      _id: req.params.id,
      temple: req.user.id,
    });

    if (!pickup) return res.status(404).json({ message: "Pickup not found" });
    if (pickup.status !== "pending")
      return res.status(400).json({ message: "Can only accept pending requests" });

    pickup.status = "accepted";
    pickup.scheduledDate = req.body.scheduledDate || new Date();
    await pickup.save();

    res.json({ message: "Pickup accepted", pickup });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ────────────────────────────────────────
// PATCH /api/temple/pickups/:id/reject
// Temple rejects a vendor request
// ────────────────────────────────────────
router.patch("/pickups/:id/reject", async (req, res) => {
  try {
    const pickup = await Pickup.findOne({
      _id: req.params.id,
      temple: req.user.id,
    });

    if (!pickup) return res.status(404).json({ message: "Pickup not found" });

    pickup.status = "rejected";
    await pickup.save();

    res.json({ message: "Pickup rejected", pickup });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ────────────────────────────────────────
// PATCH /api/temple/pickups/:id/complete
// Mark a pickup as completed
// ────────────────────────────────────────
router.patch("/pickups/:id/complete", async (req, res) => {
  try {
    const pickup = await Pickup.findOne({
      _id: req.params.id,
      temple: req.user.id,
    });

    if (!pickup) return res.status(404).json({ message: "Pickup not found" });

    pickup.status = "completed";
    pickup.completedDate = new Date();
    await pickup.save();

    res.json({ message: "Pickup marked completed", pickup });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ────────────────────────────────────────
// GET /api/temple/listings
// Get all active flower listings by this temple
// ────────────────────────────────────────
router.get("/listings", async (req, res) => {
  try {
    const listings = await FlowerListing.find({
      temple: req.user.id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ────────────────────────────────────────
// POST /api/temple/listings
// Add a new flower listing
// Body: { flowerType, quantity, condition, urgency }
// ────────────────────────────────────────
router.post("/listings", async (req, res) => {
  try {
    const { flowerType, quantity, condition, urgency } = req.body;

    if (!flowerType || !quantity)
      return res.status(400).json({ message: "Flower type and quantity are required" });

    const listing = await FlowerListing.create({
      temple: req.user.id,
      flowerType,
      quantity,
      condition: condition || "Fresh",
      urgency:   urgency   || "Normal",
    });

    res.status(201).json({ message: "Listing created", listing });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ────────────────────────────────────────
// DELETE /api/temple/listings/:id
// Remove a flower listing
// ────────────────────────────────────────
router.delete("/listings/:id", async (req, res) => {
  try {
    const listing = await FlowerListing.findOne({
      _id: req.params.id,
      temple: req.user.id,
    });

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    listing.isActive = false;
    await listing.save();

    res.json({ message: "Listing removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;