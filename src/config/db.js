const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const mongoURL = process.env.MONGODB_URI;

// Initialize and connect to the MongoDB database
async function databaseConnection() {
    mongoose.set("strictQuery", true);

    try {
        await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Database connected successfully");
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

module.exports = databaseConnection;