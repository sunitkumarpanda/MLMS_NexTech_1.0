// simulator.js (optional)
const { io } = require("socket.io-client");
const socket = io("http://localhost:8000");

const items = [
  { name: "ammo", qty: 500 },
  { name: "fuel", qty: 10000 },
  { name: "medical", qty: 200 },
];

const vehicles = [
  { id: "V1", lat: 28.6139, lon: 77.2090 },
  { id: "V2", lat: 19.0760, lon: 72.8777 },
];

socket.on("connect", () => {
  console.log("simulator connected");
  setInterval(() => {
    // send inventory update
    const it = items[Math.floor(Math.random() * items.length)];
    it.qty = Math.max(0, it.qty - Math.floor(Math.random() * 15));
    socket.emit("inventory_update", it);

    // send vehicle ping
    const v = vehicles[Math.floor(Math.random() * vehicles.length)];
    v.lat += (Math.random() - 0.5) * 0.02;
    v.lon += (Math.random() - 0.5) * 0.02;
    socket.emit("vehicle_ping", v);

    console.log("sent", it.name, it.qty, "|", v.id, v.lat.toFixed(4), v.lon.toFixed(4));
  }, 2000);
});
