const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

<<<<<<< HEAD
const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
=======
const authRoutes      = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const templeRoutes    = require("./routes/temple");
const vendorRoutes    = require("./routes/vendor");
>>>>>>> 514c23e (Added backend to temples and vendors dashboard)

const app = express();

// ── Middleware ──
<<<<<<< HEAD
app.use(cors({ origin: "https://flora-cycle-u6n9.vercel.app", credentials: true }));
app.use(express.json());

// ── Routes ──
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
=======
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// ── Routes ──
app.use("/api/auth",    authRoutes);
app.use("/api",         protectedRoutes);
app.use("/api/temple",  templeRoutes);
app.use("/api/vendor",  vendorRoutes);
>>>>>>> 514c23e (Added backend to temples and vendors dashboard)

// ── Health check ──
app.get("/", (req, res) => res.json({ message: "FloraCycle API running 🌸" }));

// ── Connect to MongoDB and start server ──
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`)
    );
  })
<<<<<<< HEAD
  .catch((err) => console.error("❌ MongoDB connection error:", err));
=======
  .catch((err) => console.error("❌ MongoDB connection error:", err));
>>>>>>> 514c23e (Added backend to temples and vendors dashboard)
