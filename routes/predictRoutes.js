// routes/predictRoutes.js
const express = require("express");
const router = express.Router();

// Mock forecast (replace later with real ML)
router.get("/:item", async (req, res) => {
  const { item } = req.params;
  // For now, random usage forecast
  const forecast = Math.floor(Math.random() * 500) + 100;

  res.json({
    item,
    predicted_usage_next_week: forecast,
    recommendation:
      forecast > 300
        ? "⚠️ Stock up more for upcoming demand"
        : "✅ Current inventory level is sufficient",
  });
});

module.exports = router;
