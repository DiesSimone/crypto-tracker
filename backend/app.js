//refering to modules
const express = require("express");
const path = require("path");
const app = express(); //creating the app
const cors = require("cors");
const pricesRoute = require("./src/routes/prices_route.js");
const portfolioRoute = require("./src/routes/portfolio_route.js");

app.use(cors());//accepts requests from any domain
app.use(express.json()); //interprets all JSON requests
app.use("/prices", pricesRoute);
app.use(express.static(path.join(__dirname, "..", "frontend")))
// app.use("/portfolio", portfolioRoute);

module.exports = app;