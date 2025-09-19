// models/Vehicle.js
const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true }, // e.g., "V1"
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  status: { type: String, default: "active" },
  lastUpdate: { type: Date, default: Date.now },
});

VehicleSchema.pre("save", function (next) {
  this.lastUpdate = Date.now();
  next();
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
