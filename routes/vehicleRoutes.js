// routes/vehicleRoutes.js
const express = require("express");
const router = express.Router();
const Vehicle = require("../models/Vehicle");

// GET /api/vehicles - list vehicles
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ id: 1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/vehicles - add or update vehicle
router.post("/", async (req, res) => {
  try {
    const { id, lat, lon, status = "active" } = req.body;
    let v = await Vehicle.findOneAndUpdate(
      { id },
      { lat, lon, status, lastUpdate: Date.now() },
      { upsert: true, new: true }
    );
    res.status(201).json(v);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
