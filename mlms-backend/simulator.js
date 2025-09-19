const { io } = require("socket.io-client");

const socket = io("http://localhost:8000");

const items = [
  { name: "ammo", qty: 500 },
  { name: "fuel", qty: 10000 },
  { name: "medical", qty: 200 },
];

const vehicles = [
  { id: "V1", lat: 28.6139, lon: 77.209 },
  { id: "V2", lat: 19.076, lon: 72.8777 },
];

socket.on("connect", () => {
  console.log("Simulator connected!");

  setInterval(() => {
    // Inventory update
    const item = items[Math.floor(Math.random() * items.length)];
    item.qty = Math.max(0, item.qty - Math.floor(Math.random() * 10));
    socket.emit("inventory_update", item);

    // Vehicle ping
    const v = vehicles[Math.floor(Math.random() * vehicles.length)];
    v.lat += (Math.random() - 0.5) * 0.02;
    v.lon += (Math.random() - 0.5) * 0.02;
    socket.emit("vehicle_ping", v);

    console.log("Sent:", item, v);
  }, 2000);
});
