// routes/supplyRoutes.js
const express = require("express");
const router = express.Router();
const Supply = require("../models/Supply");

// GET /api/supplies - list all supplies
router.get("/", async (req, res) => {
  try {
    const supplies = await Supply.find().sort({ name: 1 });
    res.json(supplies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/supplies - create a supply
router.post("/", async (req, res) => {
  try {
    const { name, qty = 0, unit = "unit", minThreshold = 0 } = req.body;
    let s = await Supply.findOne({ name });
    if (s) {
      // update if exists
      s.qty = qty;
      s.unit = unit;
      s.minThreshold = minThreshold;
      await s.save();
      return res.json(s);
    }
    s = new Supply({ name, qty, unit, minThreshold });
    await s.save();
    res.status(201).json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
