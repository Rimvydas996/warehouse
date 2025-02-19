const mongoose = require("mongoose");

const connectToDatabase = async () => {
  const username = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  const cluster = process.env.MONGODB_CLUSTER;
  const dbName = process.env.MONGODB_DB;
  const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: "majority",
    });
  } catch (err) {
    console.error("❌ Could not connect to MongoDB:", err.message);
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
    throw err; // Rethrow error to handle it in app.js
  }
};

module.exports = connectToDatabase;
