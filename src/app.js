"use strict";

const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const connectToDatabase = require("./services/database");
const warehouseRouters = require("./routes/warehouseRoutes");
const authRouters = require("./routes/authRoutes");
const authorization = require("./middlewares/authMiddleware");
const corseMiddleware = require("./middlewares/corseMiddleware");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());

// Wrap database connection in an async function
const initializeApp = async () => {
  try {
    await connectToDatabase();
  } catch (err) {
    console.error("Failed to initialize database connection:", err.message);
  }
};

// Call the initialization function
initializeApp();

mongoose.connection.once("open", () => {
  console.log("✅ Prisijungta prie MongoDB sėkmingai!");
});

app.use(corseMiddleware);

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected successfully!");
});

app.get("/health", (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
      0: "Disconnected",
      1: "Connected",
      2: "Connecting",
      3: "Disconnecting",
    };

    const status = {
      status: "Server is running",
      timestamp: new Date(),
      database: {
        status: statusMap[dbStatus],
        state: dbStatus,
        name: mongoose.connection.name,
      },
    };

    if (dbStatus !== 1) {
      return res.status(503).json(status);
    }

    res.status(200).json(status);
  } catch (err) {
    console.error("Failed to initialize database connection:", err.message);
    res.status(500).json({
      status: "error",
      message: "Failed to check server health",
      error: err.message,
    });
  }
});

app.use("/warehouse", authorization, warehouseRouters);
app.use("/auth", authRouters);
app.use((req, res) => {
  res.status(404).json({ error: "Puslapis nerastas" });
});

app.use(errorHandler);
if (process.env.NODE_ENV === "development") {
  app.listen(process.env.PORT || 3001, () => {
    console.log(`Serveris veikia`);
  });
} else {
  module.exports = app;
}
