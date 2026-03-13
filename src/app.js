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
const AppError = require("./utils/errors/AppError");
const ErrorTypes = require("./utils/errors/errorTypes");

app.use(express.json());
app.use(corsMiddleware);

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    return next();
  } catch (err) {
    return next(new AppError("Database connection failed", 500, ErrorTypes.DATABASE_ERROR));
  }
});

app.get("/", (req, res) => {
  res.send("✅ Backend is running. Use /health, /auth, /warehouse");
});

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

app.use("/auth", authRouters);
app.use("/warehouse", authorization, warehouseRouters);

app.use((req, res, next) => {
  return next(new AppError("Puslapis nerastas", 404, ErrorTypes.NOT_FOUND_ERROR));
});

app.use(errorHandler);

module.exports = app;
