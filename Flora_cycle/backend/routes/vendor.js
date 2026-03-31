const express = require("express");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const Vendor = require("../models/Vendor");
const Pickup = require("../models/Pickup");
const FlowerListing = require("../models/FlowerListing");
const Temple = require("../models/Temple");

const router = express.Router();

// All routes here require login + vendor role
router.use(protect);
router.use(restrictTo("vendor"));


// ────────────────────────────────────────
// GET /api/vendor/dashboard
// Returns all data needed for vendor dashboard overview
// ────────────────────────────────────────
router.get("/dashboard", async (req, res) => {
  try {
    const vendorId = req.user.id;

    // Get vendor profile
    const vendor = await Vendor.findById(vendorId).select("-password");

    // Get all pickups for this vendor
    const allPickups = await Pickup.find({ vendor: vendorId })
      .populate("temple", "name city address")
      .sort({ createdAt: -1 });

    // Stats
    const completed = allPickups.filter(p => p.status === "completed");
    const active    = allPickups.filter(p => p.status === "accepted");
    const pending   = allPickups.filter(p => p.status === "pending");

    const totalCollected  = completed.reduce((sum, p) => sum + p.quantity, 0);
    const templePartners  = [...new Set(completed.map(p => p.temple?._id?.toString()))].length;

    // Nearby listings (same city as vendor)
    const nearbyListings = await FlowerListing.find({
      isActive: true,
    })
      .populate("temple", "name city address phone")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      vendor,
      stats: {
        totalCollected,
        activePickups: active.length,
        completedPickups: completed.length,
        templePartners,
        pendingRequests: pending.length,
      },
      activePickups: active.slice(0, 3),
      recentPickups: allPickups.slice(0, 5),
      nearbyListings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ────────────────────────────────────────
// GET /api/vendor/pickups
// Get all pickups for this vendor
// ────────────────────────────────────────
router.get("/pickups", async (req, res) => {
  try {
    const pickups = await Pickup.find({ vendor: req.user.id })
      .populate("temple", "name city address phone")
      .sort({ createdAt: -1 });

    res.json(pickups);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ────────────────────────────────────────
// GET /api/vendor/requests
// Get all pickup requests sent by this vendor
// ────────────────────────────────────────
router.get("/requests", async (req, res) => {
  try {
    const requests = await Pickup.find({ vendor: req.user.id })
      .populate("temple", "name city")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ────────────────────────────────────────
// POST /api/vendor/request
// Vendor sends a pickup request to a temple
// Body: { templeId, flowerType, quantity, listingId? }
// ────────────────────────────────────────
router.post("/request", async (req, res) => {
  try {
    const { templeId, flowerType, quantity, listingId } = req.body;

    if (!templeId || !flowerType || !quantity)
      return res.status(400).json({ message: "Temple, flower type and quantity are required" });

    // Check temple exists
    const temple = await Temple.findById(templeId);
    if (!temple) return res.status(404).json({ message: "Temple not found" });

    const pickup = await Pickup.create({
      temple:     templeId,
      vendor:     req.user.id,
      flowerType,
      quantity,
      status:     "pending",
    });

    // If linked to a listing, optionally deactivate it
    if (listingId) {
      await FlowerListing.findByIdAndUpdate(listingId, { isActive: false });
    }

    res.status(201).json({ message: "Request sent to temple", pickup });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ────────────────────────────────────────
// PATCH /api/vendor/pickups/:id/complete
// Vendor marks a pickup as completed after collection
// ────────────────────────────────────────
router.patch("/pickups/:id/complete", async (req, res) => {
  try {
    const pickup = await Pickup.findOne({
      _id: req.params.id,
      vendor: req.user.id,
    });

    if (!pickup) return res.status(404).json({ message: "Pickup not found" });
    if (pickup.status !== "accepted")
      return res.status(400).json({ message: "Can only complete accepted pickups" });

    pickup.status = "completed";
    pickup.completedDate = new Date();
    await pickup.save();

    res.json({ message: "Pickup completed", pickup });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// ────────────────────────────────────────
// GET /api/vendor/listings
// Get all active flower listings (from all temples)
// Vendors browse this to find flowers to collect
// ────────────────────────────────────────
router.get("/listings", async (req, res) => {
  try {
    const listings = await FlowerListing.find({ isActive: true })
      .populate("temple", "name city address phone")
      .sort({ urgency: -1, createdAt: -1 }); // urgent first

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;