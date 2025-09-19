// server.js
require("dotenv").config();
const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");
const Supply = require("./models/Supply");
const Vehicle = require("./models/Vehicle");

const supplyRoutes = require("./routes/supplyRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api/supplies", supplyRoutes);
app.use("/api/vehicles", vehicleRoutes);

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// Simple health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Socket.IO for realtime streams
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("inventory_update", async (data) => {
    try {
      // data: { name, qty, unit?, minThreshold? }
      if (!data || !data.name) return;
      const update = {
        qty: data.qty ?? 0,
        unit: data.unit ?? "unit",
      };
      // upsert supply
      const supply = await Supply.findOneAndUpdate(
        { name: data.name },
        { ...update, updatedAt: Date.now() },
        { upsert: true, new: true }
      );
      // broadcast to all connected clients
      io.emit("inventory_update", supply);
    } catch (err) {
      console.error("inventory_update error:", err.message);
    }
  });

  socket.on("vehicle_ping", async (data) => {
    try {
      // data: { id, lat, lon, status? }
      if (!data || !data.id) return;
      const v = await Vehicle.findOneAndUpdate(
        { id: data.id },
        { lat: data.lat, lon: data.lon, status: data.status ?? "active", lastUpdate: Date.now() },
        { upsert: true, new: true }
      );
      io.emit("vehicle_ping", v);
    } catch (err) {
      console.error("vehicle_ping error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
const predictRoutes = require("./routes/predictRoutes");
app.use("/api/predict", predictRoutes);

const routeRoutes = require("./routes/routeRoutes");
app.use("/api/route", routeRoutes);

const alertRoutes = require("./routes/alertRoutes");
app.use("/api/alerts", alertRoutes);
