const mongoose = require("mongoose");

async function connectDb(){
    const uri = "mongodb+srv://simone:admin@cluster0.skdrjsr.mongodb.net/crypto-tracker?appName=Cluster0";
    await mongoose.connect(uri);
    console.log("Connected to database");
}

module.exports = connectDb