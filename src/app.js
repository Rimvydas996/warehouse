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

connectToDatabase();

mongoose.connection.once("open", () => {
  console.log("✅ Prisijungta prie MongoDB sėkmingai!");
});

app.use(corseMiddleware);
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

  res.status(200).json({
    status: "Server is running",
    timestamp: new Date(),
    database: {
      status: dbStatus,
      name: mongoose.connection.name,
    },
  });
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
