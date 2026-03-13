const mongoose = require("mongoose");
const AppError = require("../utils/errors/AppError");
const ErrorTypes = require("../utils/errors/errorTypes");

let isConnected = false; // singleton flag

const connectToDatabase = async () => {
  if (isConnected) return; // reuse existing connection

    const username = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;
    const cluster = process.env.MONGODB_CLUSTER;
    const dbName = process.env.MONGODB_DB;

    if (!username || !password || !cluster || !dbName) {
      throw new AppError(
        "Missing required MongoDB environment variables",
        500,
        ErrorTypes.DATABASE_ERROR
      );
    }

  const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: "majority",
    });
    isConnected = true;
    if (process.env.NODE_DEBUG === "true") {
      console.log("✅ MongoDB connected");
    }
  } catch (err) {
    if (process.env.NODE_DEBUG === "true") {
      console.error("❌ Could not connect to MongoDB:", err.message);
    }
    throw err; // let the request fail gracefully
  }
};

module.exports = connectToDatabase;
