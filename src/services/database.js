const mongoose = require("mongoose");

let isConnected = false; // singleton flag

const connectToDatabase = async () => {
    if (isConnected) return; // reuse existing connection

    const username = process.env.MONGODB_USER;
    const password = process.env.MONGODB_PASSWORD;
    const cluster = process.env.MONGODB_CLUSTER;
    const dbName = process.env.MONGODB_DB;

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
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ Could not connect to MongoDB:", err.message);
        throw err; // let the request fail gracefully
    }
};

module.exports = connectToDatabase;
