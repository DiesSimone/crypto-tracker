const mongoose = require("mongoose");
require("dotenv").config();

async function connectDb(){
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to database");
}

module.exports = connectDb