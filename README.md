# MLMS\_NexTech\_1.0

A project developed for **Stage 2 – In-person NexTech 1.0 Hackathon**.
This repository contains the codebase for MLMS, a logistics and management system built using Node.js, Express, MongoDB, and a simple frontend (HTML, CSS, JS).

---

## Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
* [Configuration](#configuration)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* RESTful APIs for logistics and resource management
* MongoDB models for storing and retrieving data
* Simulation script (`simulator.js`) for testing events or workflows
* Modular project structure (routes, models, config)
* Static frontend with HTML, CSS, and JS

---

## Tech Stack

* **Backend / Server:** Node.js, Express
* **Database:** MongoDB (Atlas / local)
* **Frontend:** HTML, CSS, JavaScript
* **Environment Management:** dotenv (`.env` file)

---

## Project Structure

```
MLMS_NexTech_1.0/
├── config/             ← Configuration files (e.g., DB connection)  
├── models/             ← MongoDB schemas / models  
├── routes/             ← Express route handlers  
├── public/             ← Static assets (CSS, JS, images)  
├── server.js           ← Main server entry point  
├── simulator.js        ← Data / event simulator  
├── package.json        ← Dependencies & scripts  
├── .env                ← Environment variables (not committed)  
└── ...
```

---

## Getting Started

### Prerequisites

* Node.js (v16 or higher recommended)
* npm (comes with Node)
* MongoDB Atlas account (or local MongoDB instance)

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/sunitkumarpanda/MLMS_NexTech_1.0.git
   cd MLMS_NexTech_1.0
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:

   ```
   PORT=3000
   MONGO_URI=<your MongoDB Atlas connection string>
   SECRET_KEY=<any secret key>
   ```

4. Start the server:

   ```bash
   npm start
   ```

   Or for development:

   ```bash
   npm run dev
   ```

5. Visit `http://localhost:3000` in your browser.

---

## Usage

* Interact with the frontend at `http://localhost:3000`
* API endpoints are served via Express routes in the `routes/` folder
* Use `node simulator.js` to run simulations (optional)

---

## Contributing

1. Fork this repo
2. Create a new branch: `git checkout -b feature/YourFeatureName`
3. Commit changes: `git commit -m "Add new feature"`
4. Push the branch: `git push origin feature/YourFeatureName`
5. Open a Pull Request

---

## License

This project was built as part of the **NexTech 1.0 Hackathon**.
Add a license here if you intend to open source it (e.g., MIT).

---

## Authors & Acknowledgments

* Developed by: **Sunit Kumar Panda** and team
* Built during: **NexTech 1.0 Hackathon**
