const mongoose = require("mongoose");
const { MONGO_DB_URL } = require("./config");

const connectDB = async () => {
  try {
    const uri = MONGO_DB_URL;
    if (!uri) {
      throw new Error(
        "MONGO_URI is not defined in environment variables. Check your Vercel project settings.",
      );
    }
    const conn = await mongoose.connect(uri, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};
module.exports = connectDB;
