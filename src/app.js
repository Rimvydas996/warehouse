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

app.use(express.json());

connectToDatabase();

mongoose.connection.once("open", () => {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Serveris veikia ant ${port} porto`);
  });
});
app.use(corseMiddleware);
app.use("/warehouse", authorization, warehouseRouters);
app.use("/auth", authRouters);
app.use((req, res) => {
  res.status(404).json({ error: "Puslapis nerastas" });
});
