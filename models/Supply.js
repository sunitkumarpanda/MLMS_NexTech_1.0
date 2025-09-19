// models/Supply.js
const mongoose = require("mongoose");

const SupplySchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  qty: { type: Number, required: true, default: 0 },
  unit: { type: String, default: "unit" },
  minThreshold: { type: Number, default: 0 }, // optional for reorder logic
  updatedAt: { type: Date, default: Date.now },
});

SupplySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Supply", SupplySchema);
