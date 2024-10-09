const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const mongoURL = process.env.MONGODB_URI;

function databaseConnection() {
    mongoose.set("strictQuery", true);
    mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true, })
        .then(() => {
            console.log("Database connected successfully");
        })
        .catch((err) => {
            console.log("Database not connected successfully: " + err);
        });
}

module.exports = databaseConnection;