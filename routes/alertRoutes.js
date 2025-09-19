const express = require("express");
const router = express.Router();
const Supply = require("../models/Supply");
const Vehicle = require("../models/Vehicle");

// GET /api/alerts → check conditions and return alerts
router.get("/", async (req, res) => {
  const alerts = [];

  const supplies = await Supply.find();
  supplies.forEach(s => {
    if (s.qty < 50) {
      alerts.push(`⚠️ Low stock: ${s.name} only has ${s.qty} ${s.unit}`);
    }
  });

  const vehicles = await Vehicle.find();
  const now = Date.now();
  vehicles.forEach(v => {
    const last = new Date(v.lastUpdate || now);
    if ((now - last.getTime()) / 1000 > 300) { // 5 min idle
      alerts.push(`🚛 Vehicle ${v.id} has been idle for > 5 minutes`);
    }
  });

  res.json({ alerts });
});

module.exports = router;
