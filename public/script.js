// public/script.js
const socket = io(); // connects to same host

const inventoryList = document.getElementById("inventoryList");
const vehiclesList = document.getElementById("vehiclesList");
const loadDataBtn = document.getElementById("loadDataBtn");
let supplyChart; // global chart reference
let vehicleChart;


// Keep a small in-memory map to show latest entries per name/id (prettier UI)
const latestSupplies = new Map();
const latestVehicles = new Map();

// 🌍 [ADD THIS] Initialize Leaflet map
const map = L.map("map").setView([20.5937, 78.9629], 5); // India center
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Dictionary to keep track of vehicle markers
const vehicleMarkers = {};

function renderSupplies() {
  inventoryList.innerHTML = "";
  const arr = Array.from(latestSupplies.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  arr.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = `${s.name} — ${s.qty} ${s.unit ?? ""}    (${new Date(
      s.updatedAt
    ).toLocaleTimeString()})`;

    // 🧠 Add Predict button
    const btn = document.createElement("button");
    btn.textContent = "🔮 Predict";
    btn.style.marginLeft = "10px";
    btn.onclick = () => predictItem(s.name);

    li.appendChild(btn);
    inventoryList.appendChild(li);
    updateSupplyChart();

  });
}

function updateSupplyChart() {
  const labels = [];
  const values = [];

  latestSupplies.forEach((s) => {
    labels.push(s.name);
    values.push(s.qty);
  });

  if (supplyChart) {
    supplyChart.data.labels = labels;
    supplyChart.data.datasets[0].data = values;
    supplyChart.update();
  } else {
    const ctx = document.getElementById("supplyChart").getContext("2d");
    supplyChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Current Stock Levels",
            data: values,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    });
  }
}


function renderVehicles() {
  vehiclesList.innerHTML = "";
  const arr = Array.from(latestVehicles.values()).sort((a, b) =>
    a.id > b.id ? 1 : -1
  );
  arr.forEach((v) => {
    const li = document.createElement("li");
    li.textContent = `${v.id} → [${v.lat.toFixed(4)}, ${v.lon.toFixed(
      4
    )}]  • ${v.status || "active"} (${new Date(v.lastUpdate).toLocaleTimeString()})`;
    vehiclesList.appendChild(li);
    updateVehicleChart();

  });
}

async function predictItem(itemName) {
  try {
    const res = await fetch(`/api/predict/${itemName}`);
    const data = await res.json();

    // Show in an alert for now (you can upgrade to modal/box)
    alert(
      `Prediction for ${itemName}:\n` +
      `📈 Next week usage: ${data.predicted_usage_next_week}\n` +
      `${data.recommendation}`
    );
  } catch (err) {
    console.error("Prediction error", err);
    alert("Failed to get prediction. See console.");
  }
}

function updateVehicleChart() {
  const statusCounts = { active: 0, idle: 0, maintenance: 0 };

  latestVehicles.forEach((v) => {
    const st = v.status?.toLowerCase() || "active";
    if (statusCounts[st] !== undefined) {
      statusCounts[st]++;
    }
  });

  const labels = Object.keys(statusCounts);
  const values = Object.values(statusCounts);

  if (vehicleChart) {
    vehicleChart.data.labels = labels;
    vehicleChart.data.datasets[0].data = values;
    vehicleChart.update();
  } else {
    const ctx = document.getElementById("vehicleChart").getContext("2d");
    vehicleChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Vehicles by Status",
            data: values,
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",   // active
              "rgba(255, 205, 86, 0.6)",   // idle
              "rgba(255, 99, 132, 0.6)",   // maintenance
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 205, 86, 1)",
              "rgba(255, 99, 132, 1)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
        },
      },
    });
  }
}


// Socket listeners
socket.on("connect", () => {
  console.log("Connected to server via Socket.IO");
});

socket.on("inventory_update", (data) => {
  // data may be a full mongoose object; normalize fields
  const s = {
    name: data.name,
    qty: data.qty ?? 0,
    unit: data.unit ?? "unit",
    updatedAt: data.updatedAt ?? Date.now(),
  };
  latestSupplies.set(s.name, s);
  renderSupplies();
});

socket.on("vehicle_ping", (data) => {
  const v = {
    id: data.id,
    lat: Number(data.lat),
    lon: Number(data.lon),
    status: data.status ?? "active",
    lastUpdate: data.lastUpdate ?? Date.now(),
  };
  latestVehicles.set(v.id, v);
  renderVehicles();

  // 🌍 [ADD THIS] Update Leaflet map markers in real-time
  if (!vehicleMarkers[v.id]) {
    vehicleMarkers[v.id] = L.marker([v.lat, v.lon])
      .addTo(map)
      .bindPopup(`<b>${v.id}</b><br>Status: ${v.status}`);
  } else {
    vehicleMarkers[v.id].setLatLng([v.lat, v.lon]);
    vehicleMarkers[v.id].setPopupContent(
      `<b>${v.id}</b><br>Status: ${v.status}`
    );
  }
});

// Load stored data (REST)
loadDataBtn.addEventListener("click", async () => {
  try {
    loadDataBtn.disabled = true;
    loadDataBtn.textContent = "Loading…";

    const supplies = await fetch("/api/supplies").then((r) => r.json());
    const vehicles = await fetch("/api/vehicles").then((r) => r.json());

    supplies.forEach((s) => {
      latestSupplies.set(s.name, s);
    });
    vehicles.forEach((v) => {
      latestVehicles.set(v.id, v);

      // 🌍 [ADD THIS] Place stored vehicles on map immediately
      if (!vehicleMarkers[v.id]) {
        vehicleMarkers[v.id] = L.marker([v.lat, v.lon])
          .addTo(map)
          .bindPopup(`<b>${v.id}</b><br>Status: ${v.status}`);
      }
    });

    renderSupplies();
    renderVehicles();
  } catch (err) {
    console.error("load data error", err);
    alert("Failed to load data. See console.");
  } finally {
    loadDataBtn.disabled = false;
    loadDataBtn.textContent = "📦 Load Stored Data";
  }
});
// 🚀 [ADD THIS] Optimize Distribution Button
document.getElementById("optimizeBtn").addEventListener("click", async () => {
  try {
    // Example: supply location (center India for demo)
    const supplyLat = 23.2599;
    const supplyLon = 77.4126;

    // Collect all current vehicles
    const vehicles = Array.from(latestVehicles.values());

    if (vehicles.length === 0) {
      alert("No vehicles available to optimize!");
      return;
    }

    // Call backend optimization route
    const res = await fetch("/api/route/assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ supplyLat, supplyLon, vehicles }),
    });

    const data = await res.json();

    // Show result
    // Show result
alert(`Optimization Result:\n${data.recommendation}`);

// 🌍 Highlight supply location
const supplyMarker = L.marker([supplyLat, supplyLon], { 
  icon: L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30]
  })
}).addTo(map).bindPopup("📦 Supply Location").openPopup();

// 🌍 Draw line from assigned vehicle to supply
if (data.assignedVehicle && vehicleMarkers[data.assignedVehicle.id]) {
  const vehicle = data.assignedVehicle;

  // Remove any existing route layer
  if (window.currentRoute) {
    map.removeLayer(window.currentRoute);
  }

  const routeCoords = [
    [vehicle.lat, vehicle.lon],
    [supplyLat, supplyLon],
  ];

  window.currentRoute = L.polyline(routeCoords, { color: "blue", weight: 4 })
    .addTo(map)
    .bindPopup(`Route: ${vehicle.id} → Supply`)
    .openPopup();

  // Zoom to fit
  map.fitBounds(window.currentRoute.getBounds());
}

  } catch (err) {
    console.error("Optimization error", err);
    alert("Failed to optimize. See console.");
  }
});

const alertsList = document.getElementById("alertsList");

async function fetchAlerts() {
  try {
    const res = await fetch("/api/alerts");
    const data = await res.json();
    alertsList.innerHTML = "";
    data.alerts.forEach(a => {
      const li = document.createElement("li");
      li.textContent = a;
      alertsList.appendChild(li);
    });
  } catch (err) {
    console.error("alerts error", err);
  }
}

// Fetch alerts every 10 seconds
setInterval(fetchAlerts, 10000);
