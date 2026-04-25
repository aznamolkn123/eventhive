// ============================================================
// CONFIGURATION
// Must run first - loads environment variables from .env file
// Without this, process.env.PORT and process.env.MONGO_URI would be undefined
// ============================================================
require("dotenv").config();
const connectDB = require("./config/db");
// ============================================================
// IMPORTS
// Load required packages for the server
// ============================================================
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");

// ============================================================
// SERVER SETUP
// Create Express app instance - this is our server
// All routes and middleware attach to this app object
// ============================================================
const app = express();

// ============================================================
// MIDDLEWARE
// These functions run on every request before the route handler
// - cors() : allows frontend (different origin) to communicate with backend
// - express.json() : parses JSON data in request bodies
// ============================================================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

// ============================================================
// ROUTES
// Define API endpoints
// GET /api/health : simple health check to verify server is running
// ============================================================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// ============================================================
// SERVER START
// Start the server on the specified port
// Uses PORT from .env file, defaults to 5000 if not set
// ============================================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();