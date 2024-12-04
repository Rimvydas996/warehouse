const mongoose = require("mongoose");

const connectToDatabase = async () => {
  const username = process.env.MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD;
  const cluster = process.env.MONGODB_CLUSTER;
  const dbName = process.env.MONGODB_DB;
  const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;
  console.log(uri);

  try {
    await mongoose.connect(uri);
    console.log("Prisijungta prie MongoDb sekmingai!");
  } catch (err) {
    console.error("Klaida jungiantis prie MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
