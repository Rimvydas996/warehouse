"use strict";

const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

const connectToDatabase = require("./services/database");
const corsMiddleware = require("./middlewares/corsMiddleware");
const authRouters = require("./routes/authRoutes");
const warehouseRouters = require("./routes/warehouseRoutes");
const authorization = require("./middlewares/authMiddleware");
const errorHandler = require("./middlewares/errorHandler");

app.use(express.json());
app.use(corsMiddleware);

// Add before your routes
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        res.status(500).json({ error: "Database connection failed" });
    }
});
app.get("/", (req, res) => {
    res.send("✅ Backend is running. Use /health, /auth, /warehouse");
});
// Health route
app.get("/health", (req, res) => {
    const statusMap = { 0: "Disconnected", 1: "Connected", 2: "Connecting", 3: "Disconnecting" };
    const dbState = mongoose.connection.readyState;
    res.json({
        status: "Server is running",
        timestamp: new Date(),
        database: {
            state: dbState,
            status: statusMap[dbState],
            name: mongoose.connection.name,
        },
    });
});

// Routes
app.use("/auth", authRouters);
app.use("/warehouse", authorization, warehouseRouters);

// 404 handler
app.use((req, res) => res.status(404).json({ error: "Puslapis nerastas" }));

// Global error handler
app.use(errorHandler);

module.exports = app;
