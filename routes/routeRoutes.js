// routes/routeRoutes.js
const express = require("express");
const router = express.Router();

// Mock optimization: returns nearest vehicle for a supply location
router.post("/assign", async (req, res) => {
  const { supplyLat, supplyLon, vehicles } = req.body;

  if (!supplyLat || !supplyLon || !vehicles) {
    return res.status(400).json({ error: "Missing supplyLat, supplyLon, or vehicles array" });
  }

  // Compute nearest vehicle by simple Euclidean distance
  let nearest = null;
  let minDist = Infinity;

  vehicles.forEach((v) => {
    const d = Math.sqrt(
      Math.pow(v.lat - supplyLat, 2) + Math.pow(v.lon - supplyLon, 2)
    );
    if (d < minDist) {
      minDist = d;
      nearest = v;
    }
  });

  res.json({
    supply: { lat: supplyLat, lon: supplyLon },
    assignedVehicle: nearest,
    distance: minDist.toFixed(4),
    recommendation: `🚚 Assign ${nearest.id} to handle supply at [${supplyLat}, ${supplyLon}]`,
  });
});

module.exports = router;
