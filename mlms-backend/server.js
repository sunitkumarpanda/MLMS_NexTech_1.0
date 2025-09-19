const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

// Express + HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// ✅ MongoDB Atlas connection
mongoose.connect(
  "mongodb+srv://sunitpanda680_db_user:qeqC6tFH9QLZ3A1d@sunit.1l2ef2x.mongodb.net/?retryWrites=true&w=majority&appName=sunit",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
).then(() => {
  console.log("✅ Connected to MongoDB Atlas");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Mon
// ✅ Get all supplies
app.get("/api/supplies", async (req, res) => {
  try {
    const supplies = await Supply.find();
    res.json(supplies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add new supply (manual entry, optional)
app.post("/api/supplies", async (req, res) => {
  try {
    const { name, qty } = req.body;
    const supply = new Supply({ name, qty });
    await supply.save();
    res.json(supply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all vehicles
app.get("/api/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add vehicle (optional)
app.post("/api/vehicles", async (req, res) => {
  try {
    const { id, lat, lon } = req.body;
    const vehicle = new Vehicle({ id, lat, lon });
    await vehicle.save();
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
